const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//Static Middleware
app.use(express.static(publicPath));

//
io.on('connection', (socket) => {
    console.log('User connected');

    socket.emit('newMessage', {
        from: 'Dana',
        text: 'Hey, Arun',
        createdAt: '123abc'
    });

    socket.on('createMessage', function(newMessage) {
        console.log('New Message: ', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

//Server
server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});