package com.breadsb.notesapp.services;

import com.breadsb.notesapp.entities.Note;
import com.breadsb.notesapp.exceptions.MessageBodyTooLongException;
import com.breadsb.notesapp.exceptions.ResourceNotFoundException;
import com.breadsb.notesapp.repositories.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository repository;

    public void createNote(Note note) {
        int length = note.getBody().length();
        int maxLength = 255;
        if (length > maxLength) {
            throw new MessageBodyTooLongException("Message exceeds the maximum allowed length of "+ maxLength +" characters.");
        } else {
            repository.save(note);
        }
    }

    public Note getNoteById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Note not found"));
    }

    public Page<Note> getAllNotes(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public void deleteNoteById(Long id) {
        repository.deleteById(id);
    }

    public Note updateNote(Long id, Note note) {
        Note repoNote = getNoteById(id);
        repoNote.setTitle(note.getTitle());
        repoNote.setBody(note.getBody());
        repoNote.setModifiedAt(LocalDateTime.now());
        repository.save(repoNote);
        return repoNote;
    }

    public List<Note> findByCreatedAt(LocalDateTime timestamp) {
        return repository.findByCreatedAt(timestamp);
    }
}