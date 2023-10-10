package com.breadsb.notesapp.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class ApiErrorDetails {

    private LocalDateTime dateTime;
    private String message;
    private HttpStatus status;
    private String details;

}
