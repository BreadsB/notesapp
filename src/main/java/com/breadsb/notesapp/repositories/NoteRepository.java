package com.breadsb.notesapp.repositories;

import com.breadsb.notesapp.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    @Query("SELECT n FROM Note n WHERE DATE(n.createdAt) = DATE(:timestamp)")
    List<Note> findByCreatedAt(@Param("timestamp") LocalDateTime timestamp);
}