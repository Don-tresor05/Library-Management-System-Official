package com.system.Library_Backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String author;
    
    @Column(nullable = false)
    private String isbn;
    
    @Column
    private String publicationYear;
    
    @Column
    private String genre;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private boolean available = true;
}