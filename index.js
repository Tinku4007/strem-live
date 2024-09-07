const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
}); 

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('create-room', (roomId) => {
        socket.join(roomId);
        console.log(`Room ${roomId} created by ${socket.id}`);
    });

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-joined', socket.id);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('offer', (roomId, offer) => {
        socket.broadcast.to(roomId).emit('offer', socket.id, offer);
    });

    socket.on('answer', (roomId, answer) => {
        socket.broadcast.to(roomId).emit('answer', socket.id, answer);
    });

    socket.on('ice-candidate', (roomId, candidate) => {
        socket.broadcast.to(roomId).emit('ice-candidate', socket.id, candidate);
    });

    socket.on('stream', (roomId, stream) => {
        socket.broadcast.to(roomId).emit('stream', stream);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
