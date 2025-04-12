package com.system.Library_Backend.repository;


import com.system.Library_Backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Custom query methods can be added here if needed
    // Example: List<Book> findByAuthor(String author);
    List<Book> findByAvailable(boolean available);
}