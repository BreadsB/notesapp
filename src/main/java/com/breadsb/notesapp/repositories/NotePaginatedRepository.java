package com.breadsb.notesapp.repositories;

import com.breadsb.notesapp.entities.Note;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotePaginatedRepository extends PagingAndSortingRepository<Note, Long> {
    long count();
}
