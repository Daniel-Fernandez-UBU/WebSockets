'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');


var stompClient = null;
var username = null;
var level = null;
var userLevel = null;
var accept = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
	
	
    username = document.querySelector('#from').value.trim();
    password = document.querySelector('#password').value.trim();
    accept = document.querySelector('#level:checked').value.trim();
    
    console.log('Data: ', accept, username, password);
    
    if (username && password) {
        fetch(`/validateUser?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
            .then(response => response.json())
            .then(isValid => {
                if (isValid) {
                    // Almacenar el nivel del usuario actual
                    fetch(`/getLevel?username=${encodeURIComponent(username)}`)
                        .then(response => response.text())
                        .then(level => {
							
                            userLevel = parseInt(level, 10);
                            console.log('Current User level: ', userLevel);

                            usernamePage.classList.add('hidden');
                            chatPage.classList.remove('hidden');

                            var socket = new SockJS('/ws');
                            stompClient = Stomp.over(socket);

                            stompClient.connect({}, onConnected, onError);
                        })
                        .catch(error => {
                            console.error('No se ha podido recoger el nivel:', error);
                        });
                } else {
					alert("El usuario no existe.");
                }
            })
            .catch(error => {
                console.error('No se ha podido validar el usuario:', error);
            });
    }
    event.preventDefault();

}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({from: username, from_level: userLevel, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            from: username,
            text: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
	
    var message = JSON.parse(payload.body);
    
    var fromLevel = parseInt(message.from_level, 10);
    
	var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.text = message.from + ' se ha unido! ' + accept + ' acepta mensajes de niveles inferiores a: ' + fromLevel;
        var textElement = document.createElement('p');
	    var messageText = document.createTextNode(message.text);
	    textElement.appendChild(messageText);
	
	    messageElement.appendChild(textElement);
	
	    messageArea.appendChild(messageElement);
    	messageArea.scrollTop = messageArea.scrollHeight;
    	
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.text = message.from + ' se ha ido!';
        
    	var textElement = document.createElement('p');
	    var messageText = document.createTextNode(message.text);
	    textElement.appendChild(messageText);
	
	    messageElement.appendChild(textElement);
	
	    messageArea.appendChild(messageElement);
    	messageArea.scrollTop = messageArea.scrollHeight;
    	
    } else {
		if ((accept === 'si' || (accept === 'no' && fromLevel >= userLevel))){
	        messageElement.classList.add('chat-message');
	
	        var avatarElement = document.createElement('i');
	        var avatarText = document.createTextNode(message.from[0]);
	        avatarElement.appendChild(avatarText);
	        avatarElement.style['background-color'] = getAvatarColor(message.from);
	
	        messageElement.appendChild(avatarElement);
	
	        var usernameElement = document.createElement('span');
	        var usernameText = document.createTextNode(message.from_level + " - " + message.from + " " + message.from_id);
	        usernameElement.appendChild(usernameText);
	        messageElement.appendChild(usernameElement);
	        
	        var textElement = document.createElement('p');
		    var messageText = document.createTextNode(message.text);
		    textElement.appendChild(messageText);
		
		    messageElement.appendChild(textElement);
		
		    messageArea.appendChild(messageElement);
	    	messageArea.scrollTop = messageArea.scrollHeight;
	     } 
   
    }
    
    
	


}


function clearMessageArea() {
    while (messageArea.firstChild) {
        messageArea.removeChild(messageArea.firstChild);
    }
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function disconnect() {
    clearMessageArea();
    stompClient.disconnect();
    usernamePage.classList.remove('hidden');
    chatPage.classList.add('hidden');

}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
document.getElementById('disconnectButton').addEventListener('click', disconnect);
