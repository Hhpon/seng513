var express = require('express');
var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

//array for users and connections
users = [];
connections = [];


/*
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');

});
*/
app.use(express.static(__dirname + '/public'));


io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);


    //disconnect

    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    //send message
    socket.on('send message', function(data){
        //console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });


    function updateUsernames(){
        io.sockets.emit('get users', users);
    }


});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
