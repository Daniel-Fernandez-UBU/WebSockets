package es.ubu.lsi.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import es.ubu.lsi.model.ChatMessage;
import es.ubu.lsi.service.UserService;


@Controller
public class ChatController {
	
	@Autowired
	private UserService userService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
    	Date date = new Date();
    	String currentDate = new SimpleDateFormat().format(date);
    	chatMessage.setFrom_id(currentDate);
    	chatMessage.setFrom_level(userService.userLevel(chatMessage.getFrom()));
    	System.out.println("User level: " + userService.userLevel(chatMessage.getFrom()));
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, 
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getFrom());
        return chatMessage;
    }

}