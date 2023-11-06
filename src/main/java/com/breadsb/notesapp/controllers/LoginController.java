package com.breadsb.notesapp.controllers;

import com.breadsb.notesapp.services.LoginAttemptServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @Autowired
    LoginAttemptServiceImpl loginService;

    @GetMapping("/login")
    public String getLoginPage() {
        if(loginService.isAuthenticated()) {
            return "redirect:view-messages";
        }
        return "login";
    }

    @GetMapping("/view-messages")
    public String getNoteMainPage() {
        return "app/view-messages";
    }
}