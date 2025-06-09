package com.system.Library_Backend.repository;

import com.system.Library_Backend.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
    List<Loan> findByBookId(Long bookId);
    boolean existsByBookIdAndReturnedDateIsNull(Long bookId);
    long countByUserIdAndReturnedDateIsNull(Long userId);
    List<Loan> findByReturnedDateIsNull();
    List<Loan> findByDueDateAndReturnedDateIsNull(LocalDate dueDate);
}