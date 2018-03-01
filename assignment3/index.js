//taken from: https://socket.io/get-started/chat/
//socket io chat tutorial
var express = require('express');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = 3000;


var userList = [];
var userMessages = [];

var words;
var nick;
var newColour;
var newUser;
var index;
var userTime;
var messageSent;

app.use(express.static(__dirname + '/public'));

http.listen( port, function () {
    console.log('listening on port', port);
});


// listen to 'chat' messages
io.on('connection', function(socket){

    //get current time from server
    userTime = getTime();

    socket.on('addUser', function(addID){
        userList.push(addID);

        io.emit('usernames', userList);
        socket.emit('loadMessages', userMessages);
        io.emit('changeID', addID);
    });

    socket.on('chat', function(chatMsg, userID, userColour){

        words = chatMsg.split(" ");
        //check the first word for either color or nick
        //to change color or nickname
        nick = words[0];

        if(nick === "/nickcolor") {
            newColour = words[1];
            socket.emit('changeColour', newColour);
        }

        else if(nick === "/nick") {
            newUser = words[1];
            index = userList.indexOf(newUser);
            socket.emit('changeID', newUser);
            io.emit('usernames', userList);

        }

        messageSent = userTime + ": "  + '<span style="color:' + userColour + '">' + userID + " </span>" + chatMsg + "<br>" ;
        userMessages.push(messageSent);

        socket.emit('chat', chatMsg, userTime, userID, userColour, '');
    });

    socket.on('disconnect', function(){
       userList.splice(userList.indexOf((socket.nick)));

        io.emit('changeList', userList);
    });


});


function getTime() {
    var displayTime;
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();

    if(minute < 10)
    {
        minute = "0" + minute;
    }
    if (hour > 12){
        hour = hour -12;
        displayTime = hour + ":" + minute + "pm" + "   ";
    }
    else{
        displayTime = hour + ":" + minute + "am" + "   ";
    }
    return displayTime;
}

