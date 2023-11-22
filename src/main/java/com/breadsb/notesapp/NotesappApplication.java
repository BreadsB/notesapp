package com.breadsb.notesapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
public class NotesappApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotesappApplication.class, args);
	}
}