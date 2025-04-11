package com.system.Library_Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.system.Library_Backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find users by email or role
    User findByEmail(String email);
    User findByRole(String role);
    User findByName(String name);
    
}
