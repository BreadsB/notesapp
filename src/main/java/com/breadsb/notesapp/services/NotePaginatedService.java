package com.breadsb.notesapp.services;

import com.breadsb.notesapp.entities.Note;
import com.breadsb.notesapp.repositories.NotePaginatedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotePaginatedService {

    private final NotePaginatedRepository repository;

    public Page<Note> getNotesPage(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public int getNumberOfPages(int size) {
        long count = repository.count();
        return (int) Math.ceil((double) count/size);
    }
}
