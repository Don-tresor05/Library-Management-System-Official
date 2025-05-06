package com.system.Library_Backend.service;

import com.system.Library_Backend.exceptions.BookNotAvail;
import com.system.Library_Backend.exceptions.MaxLoans;
import com.system.Library_Backend.model.*;
import com.system.Library_Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ActivityLogService activityLogService;

    @Autowired
    public LoanService(LoanRepository loanRepository,
                     UserRepository userRepository,
                     BookRepository bookRepository,
                     ActivityLogService activityLogService) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public Loan createLoan(Loan loan) {
        User user = userRepository.findById(loan.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Book book = bookRepository.findById(loan.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // Validate book availability
        if (!book.isAvailable() || loanRepository.existsByBookIdAndReturnedDateIsNull(book.getId())) {
            throw new BookNotAvail();
        }

        // Validate user's active loans
        long activeLoans = loanRepository.countByUserIdAndReturnedDateIsNull(user.getId());
        if (activeLoans >= 3) {
            throw new MaxLoans();
        }

        // Create the loan
        loan.setUser(user);
        loan.setBorrowedDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusWeeks(2));
        
        // Update book status
        book.setAvailable(false);
        bookRepository.save(book);
        
        // Save the loan
        Loan savedLoan = loanRepository.save(loan);
        
        // Log the activity
        activityLogService.logActivity(user, book, "BORROW");
        
        return savedLoan;
    }

    @Transactional
    public Loan returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));
        
        if (loan.getReturnedDate() != null) {
            throw new RuntimeException("Book already returned");
        }
        
        // Update loan status
        loan.setReturnedDate(LocalDate.now());
        
        // Update book status
        Book book = loan.getBook();
        book.setAvailable(true);
        bookRepository.save(book);
        
        // Save the updated loan
        Loan updatedLoan = loanRepository.save(loan);
        
        // Log the activity
        activityLogService.logActivity(loan.getUser(), book, "RETURN");
        
        return updatedLoan;
    }

    @Transactional
    public void deleteLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));
        
        // If loan wasn't returned, make the book available again
        if (loan.getReturnedDate() == null) {
            Book book = loan.getBook();
            book.setAvailable(true);
            bookRepository.save(book);
            
            // Log this as a forced return if needed
            activityLogService.logActivity(
                loan.getUser(), 
                book, 
                "FORCED_RETURN_DELETED"
            );
        }
        
        loanRepository.delete(loan);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
    }

    public List<Loan> getLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public List<Loan> getLoansByBookId(Long bookId) {
        return loanRepository.findByBookId(bookId);
    }

    public List<Loan> getActiveLoans() {
        return loanRepository.findByReturnedDateIsNull();
    }
}