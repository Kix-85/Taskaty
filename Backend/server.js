require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('./config/passport');
const mongoose = require('mongoose');

// Import services
const ChatService = require('./services/chat.service');
// const UserService = require('./services/user.service');

// Import routes
const auth = require('./routers/auth.routes');
const task = require('./routers/task.routes');
const user = require('./routers/user.routes');
const project = require('./routers/project.routes');
const chat = require('./routes/chat.routes');
const connectDB = require('./config/db');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:8080', 'http://localhost:5173', 'http://192.168.1.6:8080'];

// Configure CORS for Express
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Configure Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
});

// Server level middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data
app.use(cookieParser());
app.use(passport.initialize());

// Setup error handling for file uploads
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message
        });
    } else if (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + err.message
        });
    }
    next();
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO event handlers
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Authenticate user on connection
    socket.on('authenticate', async (userId) => {
        try {
            // // Verify user exists
            // const user = await UserService.getUserById(userId);
            // if (!user) {
            //     socket.disconnect();
            //     return;
            // }

            // Store user in connected users map
            connectedUsers.set(userId, {
                socketId: socket.id,
                userData: user
            });

            // Associate socket with user ID for easier access
            socket.userId = userId;

            console.log(`User ${user.name} (${userId}) authenticated`);

            // Emit online users to the newly connected user
            const onlineUserIds = Array.from(connectedUsers.keys());
            socket.emit('online-users', onlineUserIds);

            // Notify other users that this user is online
            socket.broadcast.emit('user-online', userId);
        } catch (error) {
            console.error('Authentication error:', error);
            socket.disconnect();
        }
    });

    // Handle private messages
    socket.on('private-message', async (data) => {
        try {
            const { receiverId, content, messageType } = data;

            // Create message in database
            const messageData = {
                sender: socket.userId,
                receiver: receiverId,
                content,
                messageType
            };

            
            const savedMessage = await ChatService.saveMessage(messageData);

            // Populate sender and receiver information
            const populatedMessage = await savedMessage.populate([
                { path: 'sender', select: 'name avatar' },
                { path: 'receiver', select: 'name avatar' }
            ]);

            // Send to receiver if online
            const receiverData = connectedUsers.get(receiverId);
            if (receiverData) {
                io.to(receiverData.socketId).emit('private-message', populatedMessage);
            }

            // Send back to sender for confirmation
            socket.emit('message-sent', populatedMessage);

        } catch (error) {
            console.error('Error sending private message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle marking messages as read
    socket.on('mark-messages-read', async (data) => {
        try {
            const { senderId } = data;
            await ChatService.markAsRead(senderId, socket.userId);

            // Notify sender that messages were read
            const senderData = connectedUsers.get(senderId);
            if (senderData) {
                io.to(senderData.socketId).emit('messages-read', {
                    byUserId: socket.userId
                });
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
            socket.emit('error', { message: 'Failed to mark messages as read' });
        }
    });

    // WebRTC call signaling
    socket.on('call-user', (data) => {
        const { targetId, offer, withVideo, callerName } = data;
        const receiverData = connectedUsers.get(targetId);

        if (receiverData) {
            io.to(receiverData.socketId).emit('incoming-call', {
                callerId: socket.userId,
                callerName: callerName || (socket.userData ? socket.userData.name : 'Unknown'),
                offer,
                withVideo
            });
        } else {
            // User is offline
            socket.emit('call-failed', {
                reason: 'user-offline',
                message: 'User is currently offline'
            });
        }
    });

    socket.on('call-response', (data) => {
        const { targetId, answer, accepted } = data;
        const callerData = connectedUsers.get(targetId);

        if (callerData) {
            if (accepted) {
                io.to(callerData.socketId).emit('call-accepted', {
                    answer,
                    accepterId: socket.userId
                });
            } else {
                io.to(callerData.socketId).emit('call-rejected', {
                    rejecterId: socket.userId
                });
            }
        }
    });

    socket.on('ice-candidate', (data) => {
        const { targetId, candidate } = data;
        const targetData = connectedUsers.get(targetId);

        if (targetData) {
            io.to(targetData.socketId).emit('ice-candidate', {
                candidate,
                from: socket.userId
            });
        }
    });

    socket.on('end-call', (data) => {
        const { targetId } = data;
        const targetData = connectedUsers.get(targetId);

        if (targetData) {
            io.to(targetData.socketId).emit('call-ended', {
                by: socket.userId
            });
        }
    });

    // Handle joining a room
    socket.on('join-room', ({ roomId, userId }) => {
        if (roomId && userId) {
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            console.log(`User ${userId} joined room ${roomId}`);
        }
    });

    // Handle leaving a room
    socket.on('leave-room', ({ roomId }) => {
        if (roomId) {
            socket.leave(roomId);
            console.log(`User left room ${roomId}`);
        }
    });

    // Handle chat messages
    socket.on('send-message', async (data) => {
        try {
            const { content, roomId, receiverId } = data;
            
            if (!content) {
                throw new Error('Message content is required');
            }

            // Save message to database
            const message = await ChatService.saveMessage({
                sender: socket.userId,
                receiver: receiverId,
                content,
                roomId
            });

            if (roomId) {
                // Broadcast to room
                socket.to(roomId).emit('receive-message', message);
            } else if (receiverId) {
                // Send to specific user
                const receiverSocket = connectedUsers.get(receiverId);
                if (receiverSocket) {
                    io.to(receiverSocket).emit('receive-message', message);
                }
            }

            // Send confirmation to sender
            socket.emit('message-sent', message);
        } catch (error) {
            console.error('Error handling message:', error);
            socket.emit('error', { message: error.message });
        }
    });

    // Handle video call signaling
    socket.on('video-call-signal', ({ signal, roomId, callerId }) => {
        socket.to(roomId).emit('receive-call-signal', { signal, callerId });
    });

    // Handle voice call signaling
    socket.on('voice-call-signal', ({ signal, roomId, callerId }) => {
        socket.to(roomId).emit('receive-voice-signal', { signal, callerId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        if (socket.userId) {
            connectedUsers.delete(socket.userId);
            io.emit('user-offline', socket.userId);
        }
    });
});

// API Routes
app.get('/api', (req, res) => {
    return res.send("<h1 style='text-align: center; color: #4a90e2; position: relative; top: 50%'> Welcome to the Real-Time Chat API </h1>");
});

// Mount route handlers
app.use('/api/auth', auth);
app.use('/api/task', task);
app.use('/api/user', user);
app.use('/api/project', project);
app.use('/api/chat', require('./routers/chat.routes'));

// Chat-specific routes
app.get('/api/messages/history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user._id;

        // Get recent conversations
        const conversations = await ChatService.getUserConversations(userId);

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching message history:', error);
        res.status(500).json({ error: 'Failed to fetch message history' });
    }
});

app.get('/api/messages/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const otherUserId = req.params.userId;

        const messages = await ChatService.getConversation(currentUserId, otherUserId);

        // Mark messages as read
        await ChatService.markAsRead(otherUserId, currentUserId);

        // Notify the sender that their messages were read
        const senderData = connectedUsers.get(otherUserId);
        if (senderData) {
            io.to(senderData.socketId).emit('messages-read', {
                byUserId: currentUserId
            });
        }

        res.json(messages);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    try {
        console.log(`Server running on port ${PORT}`);
        await connectDB();
        console.log('Connected to database');
        console.log('Environment variables loaded:', {
            hasGeminiKey: process.env.GEMINI_API_KEY,
            allowedOrigins: process.env.ALLOWED_ORIGINS,
            nodeEnv: process.env.NODE_ENV
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Export app for testing
module.exports = app;