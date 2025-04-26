package com.system.Library_Backend.service;

import com.system.Library_Backend.exceptions.BookNotAvail;
import com.system.Library_Backend.exceptions.MaxLoans;
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

    
    public Loan createLoan(Loan loan) {
        
        User user = userRepository.findById(loan.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        
        Book book = bookRepository.findById(loan.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
                if (!book.isAvailable() || loanRepository.existsByBookIdAndReturnedDateIsNull(book.getId())) {
                    throw new BookNotAvail();
                }

                if (loanRepository.countByUserIdAndReturnedDateIsNull(user.getId()) >= 3) {
                    throw new MaxLoans();
                }

        long activeLoans = loanRepository.countByUserIdAndReturnedDateIsNull(loan.getUser().getId());
        if (activeLoans >= 3) {
            throw new RuntimeException("User has reached the maximum number of active loans (3)");
        }
        loan.setUser(user);
        
        
        loan.setBorrowedDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusWeeks(2)); 
        
       
        book.setAvailable(false);
        bookRepository.save(book);
        
        return loanRepository.save(loan);
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

    
    public Loan returnBook(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
        
        if (loan.getReturnedDate() != null) {
            throw new RuntimeException("Book already returned");
        }
        
        loan.setReturnedDate(LocalDate.now());
        Book book = loan.getBook();
        book.setAvailable(true);
        bookRepository.save(book);
        
        return loanRepository.save(loan);
    }

   
    public void deleteLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
        
       
        if (loan.getReturnedDate() == null) {
            Book book = loan.getBook();
            book.setAvailable(true);
            bookRepository.save(book);
        }
        
        loanRepository.delete(loan);
    }
}