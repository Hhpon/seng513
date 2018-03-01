$(function() {
    var socket = io();
    var userID;
    var userColour;
    var userCount = 1;

    //at first your username will be "user 1"
    if((getCookie("userID") === "" || getCookie("userID") === null))
    {
        userID = "user " + userCount.valueOf() ;
        userCount++;
        setCookie("userID", userID);

        userColour = "green";
        setCookie("userColour", userColour);
        socket.emit('addUser', userID, userColour);
    }

    else{
         userID = getCookie("userID");
         userColour = getCookie("userColour");
         socket.emit('addUser', userID, userColour);
    }

    socket.on('loadMessages', function(messages){
        for(var i = 0; i < messages.length; i++)
        {
            $('#messagesList').append(messages[i]);
        }
    });

    $('form').submit(function(){
        socket.emit('chat', $('#enterMessage').val(), getCookie("userID"), getCookie("userColour"));
        return true;
    });


    socket.on('chat', function(msg, time, id, colour){

            $('#messagesList').append(
                $(time  + '<span style="color:' + colour + '">' + id  + " </span><b>" + msg )
            );

    });

    socket.on('changeColour', function(colour){
        setCookie('userColour', colour);
    });

    socket.on('changeID', function(id){
        setCookie('userID', id);
        $('div.currentUser').html("<h2>Your name: " + '</h2>' + "<h3>" + id + "</h3>");
    });

    socket.on('usernames', function(users){
        //console.log(users);
        /*parse through users and add to the onlineUsersList in HTML file */
        var addToUsers = "";
        for(var i = 0; i < users.length; i++){
            addToUsers += '<li>' + users[i] + '</li>';
        }
        $('#onlineUserList').html(addToUsers);
    });

});

//https://www.w3schools.com/js/js_cookies.asp
//
function getCookie(cname) {
    var name = cname + "=";
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

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}