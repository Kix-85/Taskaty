const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
}); 

const auth = require('./routers/auth.routes');
const tasks = require('./routers/task.routes');
const users = require('./routers/user.routes');

const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/tasks', tasks);
app.use('/api/users', users);

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

server.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})