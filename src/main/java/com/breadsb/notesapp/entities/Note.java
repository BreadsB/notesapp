package com.breadsb.notesapp.entities;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@ToString
@Schema(description = "Note JSON object")
public class Note {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Schema(description = "Title of the Note", accessMode = Schema.AccessMode.READ_WRITE)
    private String title;

    @NotNull
    @Schema(description = "Body of the Note", accessMode = Schema.AccessMode.READ_WRITE)
    private String body;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    public Note(String title, String body) {
        this.title = title;
        this.body = body;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}