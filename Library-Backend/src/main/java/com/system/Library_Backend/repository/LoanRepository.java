package com.system.Library_Backend.repository;

import com.system.Library_Backend.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find loans by user or book
    List<Loan> findByUserId(Long userId);
    List<Loan> findByBookId(Long bookId);
    List<Loan> findByUserIdAndBookId(Long userId, Long bookId);
    
}
