require('dotenv').config();
const auth = require('./routers/auth.routes');
const task = require('./routers/task.routes');
const user = require('./routers/user.routes');
const project = require('./routers/project.routes');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const passport = require('./config/passport');

// Handle Cors and whitelist
const whiteLists = ['http://localhost:8080', 'https://yourdomain.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (whiteLists.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // change after production
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Server level middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', auth);
app.use('/api/task', task);
app.use('/api/user', user);
app.use('/api/project', project)

// WebSocket connection
io.on('connection', socket => {
    console.log('User connected: ', socket.id);

    socket.on('chat-message', msg => {
        console.log('Message received: ', msg);
        io.emit('chat-message', msg);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
    })
})

// Server connection
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})