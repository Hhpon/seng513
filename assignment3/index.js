var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = 3000;

var cookie = require('cookies');
var cookieParser = require('cookie-parser');

var userList = [];
var userMap = new Map();
var userMessages = [];

var words;
var nick;
var newColour;
var newUser;
var index;
var userTime;
var messageSent;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(cookieParser());

// listen to 'chat' messages
io.on('connection', function(socket){

    socket.on('addUser', function(addID, addColour){
        userList.push(addID);
        userMap.set(socket, {userID: addID, colour: addColour});
        io.emit('changeList', userList);
        socket.emit('loadMessages', userMessages);
        socket.emit('changeID', addID);
    });

    socket.on('chat', function(chatMsg, userID, userColour){

        words = chatMsg.split(" ");
        //check the first word for either color or nick
        //to change color or nickname
        nick = words[0];

        if(nick === "/nickcolor")
        {
            newColour = words[1];
            userMap.set(socket, {userID: userMap.get(socket).userID, colour: newColour});
            socket.emit('changeColour', newColour);
        }

        else if(nick === "/nick")
        {
            newUser = words[1];
            index = userList.indexOf(newUser);

            if(index === -1)
            {
                socket.emit('changeID', newUser);
                userList[userList.indexOf(userID)] = newUser;
                userMap.set(socket, {userID: newUser, colour: userMap.get(socket).colour});
                io.emit('changeList', userList);
            }
        }

        userTime = getTime();


        messageSent = '<li><b>' + userTime + '</b>' + '<span style="color:' + userColour + '">' +
            userID + " </span>" + chatMsg + '</li>';

        if(userMessages.length < 200)
        {
            userMessages.push(messageSent);
        }

        else{
            userMessages.push(messageSent);
        }

        socket.emit('chat', chatMsg, userTime, userID, userColour, "bold");
        socket.broadcast.emit('chat', chatMsg, userTime, userID, userColour, "");
    });

    socket.on('disconnect', function(){
        userList = [];
        userMap.delete(socket);

        userMap.forEach(function(userInfo, socket){
            userList.push(userInfo.userID);
        });

        io.emit('changeList', userList);
    });


});


function getTime() {
    var displayTime = "";
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();

    if(minute < 10)
    {
        minute = "0" + minute;
    }
//need spacing for time: username: message
    displayTime += hour + ":" + minute + "   ";
    return displayTime;
}

app.use(express.static(__dirname + '/public'));