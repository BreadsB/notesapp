package com.breadsb.notesapp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String getLoginPage() {
        return "login";
    }

    @GetMapping("/view-messages")
    public String getNoteMainPage() {
        return "app/view-messages";
    }
}