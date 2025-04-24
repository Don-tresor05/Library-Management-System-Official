package com.system.Library_Backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Store hashed password

    @Column()
    private String phoneNumber; // Optional, can be null

    @Column()
    private String address; // Optional, can be null
    
    @Column(nullable = false)
    private String role; // "STUDENT", "LIBRARIAN", etc.
}

