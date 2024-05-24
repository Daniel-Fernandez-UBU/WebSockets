package es.ubu.lsi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import es.ubu.lsi.service.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/validateUser")
    public boolean validateUser(@RequestParam String username, @RequestParam String password) {
        return userService.userIsValid(username, password);
    }
    
    @GetMapping("/getLevel")
    public int getLevel(@RequestParam String username) {
        return userService.userLevel(username);
    }

}