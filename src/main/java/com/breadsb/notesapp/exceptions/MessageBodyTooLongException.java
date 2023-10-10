package com.breadsb.notesapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MessageBodyTooLongException extends RuntimeException {

    public MessageBodyTooLongException(String message) {
        super(message);
    }
}