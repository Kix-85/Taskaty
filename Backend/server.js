require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('./config/passport');

// Import services
const ChatService = require('./services/chat.service');
const UserService = require('./services/user.service');

// Import routes
const auth = require('./routers/auth.routes');
const task = require('./routers/task.routes');
const user = require('./routers/user.routes');
const project = require('./routers/project.routes');
const connectDB = require('./config/db');

// Create Express app and HTTP server
const app = express();
// Configure allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:8080', 'http://localhost:5173', 'https://app8080.maayn.me'];

// Configure CORS
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

// Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
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

// Routes
app.get('/api', (req, res, next) => {
    return res.send("<h1 style='text-align: center; color: red; position: relative; top: 50%'> Welcome to the Ayman's API </h1>");
});

// Mount route handlers
app.use('/api/auth', auth);
app.use('/api/task', task);
app.use('/api/user', user);
app.use('/api/project', project);

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
  console.log(`Server running on port ${PORT}`);
  await connectDB();
  console.log('Connected to database');
});

// Export app for testing
module.exports = app;