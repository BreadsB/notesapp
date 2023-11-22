package com.breadsb.notesapp.controllers;

import com.breadsb.notesapp.services.LoginAttemptServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
public class LoginController {

    @Autowired
    LoginAttemptServiceImpl loginService;

    @Operation(summary = "Access authorization to web app")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "Logged in", content = @Content),
            @ApiResponse(responseCode = "302", description = "Redirected - wrong login/password", content = @Content),
            @ApiResponse(responseCode = "405", description = "Too many wrong login attempts", content = @Content),
    })
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