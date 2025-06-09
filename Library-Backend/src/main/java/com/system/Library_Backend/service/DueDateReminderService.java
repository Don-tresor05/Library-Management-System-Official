package com.system.Library_Backend.service;
import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.system.Library_Backend.model.Loan;
import com.system.Library_Backend.repository.LoanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DueDateReminderService {
    private final LoanRepository loanRepository;
    private final EmailService emailService;
    
    @Scheduled(cron = "0 0 9 * * ?") // Runs daily at 9 AM
    public void sendDueDateReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Loan> dueLoans = loanRepository.findByDueDateAndReturnedDateIsNull(tomorrow);
        
        dueLoans.forEach(loan -> {
            emailService.sendDueDateReminder(
                loan.getUser(), 
                loan.getBook(), 
                loan.getDueDate()
            );
        });
    }
}