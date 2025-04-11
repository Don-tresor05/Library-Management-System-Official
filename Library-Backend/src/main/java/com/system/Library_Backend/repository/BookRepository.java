package com.system.Library_Backend.repository;

import com.system.Library_Backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find books by title or author
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    
}
