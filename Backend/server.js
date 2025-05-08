const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
}); 

const auth = require('./routers/auth.routes');
const task = require('./routers/task.routes');
const user = require('./routers/user.routes');
const project = require('./routers/project.routes');

const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/task', task);
app.use('/api/user', user);
app.use('/api/project', project)

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

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})