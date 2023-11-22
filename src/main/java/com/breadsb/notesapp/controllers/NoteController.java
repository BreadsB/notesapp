package com.breadsb.notesapp.controllers;

import com.breadsb.notesapp.entities.Note;
import com.breadsb.notesapp.services.NotePaginatedService;
import com.breadsb.notesapp.services.NoteService;
import io.github.bucket4j.Bucket;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin("*")
public class NoteController {

    @Autowired
    private final NoteService service;
    @Autowired
    private final NotePaginatedService paginatedService;
    Bucket bucket;

    public NoteController(NoteService service, NotePaginatedService paginatedService) {
        this.service = service;
        this.paginatedService = paginatedService;
        bucket = Bucket.builder()
                .addLimit(limit -> limit.capacity(10).refillGreedy(6,Duration.ofMinutes(1)))
                .build();
    }

    @Operation(summary = "Get a note by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found a note",
                    content = {
                            @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Note.class)
                            )
                    }),
            @ApiResponse(responseCode = "400", description = "Invalid id supplied", content = @Content),
            @ApiResponse(responseCode = "404", description = "Book not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Note> get(@Parameter(description = "Id of a book to search") @PathVariable Long id) {
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(service.getNoteById(id));
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @Operation(summary = "Create a new Note")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "201", description = "Created a new note"),
            @ApiResponse(responseCode = "400", description = "Invalid Note parameters supplied", content = @Content),
            @ApiResponse(responseCode = "415", description = "Nothing has been send (null value)", content = @Content)
    })
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> post(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Note JSON object to be transfered") @Valid @RequestBody Note note) {
        if (bucket.tryConsume(1)) {
            service.createNote(note);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @Operation(summary = "Get all existing messages")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "Found a list of notes",
                    content = {
                            @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Note.class)
                            )
                    })
    })
    @GetMapping
    public ResponseEntity<List<Note>> getAll() {
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(service.getAllNotes());
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @Operation(summary = "Update message with supplied id")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "201", description = "Updated a note", content = @Content),
            @ApiResponse(responseCode = "404", description = "Note not found", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid id format", content = @Content),
            @ApiResponse(responseCode = "415", description = "No object has been sent (null value)", content = @Content)
    })
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Note> put(@Parameter(description = "Id of a Note to update") @PathVariable Long id,
                                    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Note JSON object") @Valid @RequestBody Note note) {
        if (bucket.tryConsume(1)) {
            service.updateNote(id, note);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @Operation(summary = "Delete message with supplied id")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "201", description = "Deleted a note", content = @Content),
            @ApiResponse(responseCode = "404", description = "Note not found", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid id format", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@Parameter(description = "Id of a Note to delete") @PathVariable Long id) {
        service.deleteNoteById(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Find all messages created at supplied Date&Time")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "Found notes", content = @Content),
            @ApiResponse(responseCode = "404", description = "Notes not found", content = @Content),
            @ApiResponse(responseCode = "415", description = "Null DateTime parameter", content = @Content)
    })
    @GetMapping(value = "/by-date")
    public ResponseEntity<List<Note>> getNotesByDate(
            @Parameter(description = "Time and date when notes were created")
            @RequestParam("timestamp")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime localDate) {
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(service.findByCreatedAt(localDate));
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Note>> getPaginatedNotes(Pageable pageable) {
        if (bucket.tryConsume(1)) {
            Page<Note> notes = paginatedService.getNotesPage(pageable);
            return ResponseEntity.ok(notes);
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @GetMapping("/page/count")
    public ResponseEntity<Integer> getNumberOfPages(@RequestParam(defaultValue = "10") int size) {
        if (bucket.tryConsume(1)) {
            int number = paginatedService.getNumberOfPages(size);
            return ResponseEntity.ok(number);
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }
}