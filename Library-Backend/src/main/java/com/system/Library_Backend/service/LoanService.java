package com.system.Library_Backend.service;

import com.system.Library_Backend.model.Book;
import com.system.Library_Backend.model.Loan;
import com.system.Library_Backend.model.User;
import com.system.Library_Backend.repository.BookRepository;
import com.system.Library_Backend.repository.LoanRepository;
import com.system.Library_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Autowired
    public LoanService(LoanRepository loanRepository, 
                      UserRepository userRepository, 
                      BookRepository bookRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    // Create a new loan
    public Loan createLoan(Loan loan) {
        // Check if user exists
        User user = userRepository.findById(loan.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if book exists and is available
        Book book = bookRepository.findById(loan.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available for loan");
        }
        
        // Set dates
        loan.setBorrowedDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusWeeks(2)); // 2 weeks loan period
        
        // Update book availability
        book.setAvailable(false);
        bookRepository.save(book);
        
        return loanRepository.save(loan);
    }

    // Get all loans
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    // Get loan by ID
    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
    }

    // Get loans by user ID
    public List<Loan> getLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    // Get loans by book ID
    public List<Loan> getLoansByBookId(Long bookId) {
        return loanRepository.findByBookId(bookId);
    }

    // Return a book (end a loan)
    public Loan returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));
        
        // Update book availability
        Book book = loan.getBook();
        book.setAvailable(true);
        bookRepository.save(book);
        
        return loan;
    }

    // Delete a loan (admin only)
    public void deleteLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
        
        // If book wasn't returned, make it available
        if (loan.getReturnedDate() == null) {
            Book book = loan.getBook();
            book.setAvailable(true);
            bookRepository.save(book);
        }
        
        loanRepository.delete(loan);
    }
}