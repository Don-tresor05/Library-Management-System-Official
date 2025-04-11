package com.system.Library_Backend.model;

import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDate;

// import org.springframework.cglib.core.Local;

import jakarta.persistence.*;

@Entity
@Data
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private LocalDate borrowedDate;

    @Column(nullable = false)
    private LocalDate dueDate;
    
}
