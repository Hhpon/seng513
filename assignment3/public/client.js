$(function() {
    var socket = io();

    var userColour;
    var userCount = 1;
    var userID = "USER " + userCount;

    setCookie("userID", userID);
    //userCount++;
    var cookieUser = userID + userCount++;
    cookieUser = getCookie("userID");
    userColour = getCookie("userColour");

    socket.emit('addUser', cookieUser, userColour);

    socket.on('loadMessages', function(messages){
        for(var i = 0; i < messages.length; i++)
        {
            $('#messagesList').append(messages[i]);
        }
    });

    $('form').submit(function(){
        socket.emit('chat', $('#enterMessage').val(), getCookie("cookieUser"), getCookie("userColour"));
       //this allows to keep a persisting page rather than reloading
        $('#enterMessage').val('');
        return false;
    });


    socket.on('chat', function(chatMessage, currentTime, id, colour){

            $('#messagesList').append(
                //adds to the list in html file
                //and bolds the message sent
                $('<li>' + currentTime + ': '  + '<span style= " color: ' + colour + '">' + id  + " </span><b>" + chatMessage +'</li>' )
            );

    });

    socket.on('changeColour', function(colour){
        setCookie('userColour', colour);
    });

    socket.on('changeID', function(id){
        userCount++;
        cookieUser = "user " + userCount;
        setCookie('cookieUser', id);
        $('div.currentUser').html( " <h3>" + id + "</h3>");
    });

    socket.on('usernames', function(users){
        //console.log(users);
        //parse through users and add to the onlineUsersList in HTML file
        var addToUsers = "";
        for(var i = 0; i < users.length; i++){
            addToUsers += '<li>' + users[i] + '</li>';
        }
        $('#onlineUserList').html(addToUsers);
    });

});

//https://www.w3schools.com/js/js_cookies.asp
//
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cookieName, cookieValue) {
    document.cookie = cookieName + " = " + cookieValue  + ";";
}