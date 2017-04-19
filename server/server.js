const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

//Use socket.io with server
var server = http.createServer(app);
var io = socketIO(server);

//Static Middleware
app.use(express.static(publicPath));

//Socket IO events
//Connection event
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and Room Name are required');
        }

        socket.join(params.room);

        //Send welcome message when a new user joins
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App!!!'));

        //Broadcast when a new user joins
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined...`));

        callback();
    });

    //Listen for new message from user
    socket.on('createMessage', (newMessage, callback) => {
        console.log('New Message: ', newMessage);

        //Send the new message to all the users connected to the server
        //IO.emit emits the event to every client
        io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));

        //Ack from server
        callback();
    });

    //Listen for new location message from user
    socket.on('createLocationMessage', (coords) => {
        console.log('New Location Message: ', coords);

        //Send the new message to all the users connected to the server
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    //Disconnet event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

//Server
server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});