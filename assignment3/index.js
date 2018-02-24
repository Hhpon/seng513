//var express = require('express');
//var app = express();
var app = require('express')();

//var server = require('http').Server(app);
var http = require('http').Server(app);

//var io = require('socket.io').listen(server);
var io = require('socket.io')(http);

//array for users and connections
users = [];
connections = [];



app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);


    //disconnect

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    //send message
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data});
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
