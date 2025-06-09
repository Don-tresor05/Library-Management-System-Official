package com.system.Library_Backend.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.system.Library_Backend.model.Book;
import com.system.Library_Backend.model.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMMM d, yyyy");
    
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendBookNotification(User user, Book book, String action) {
        try {
            Context context = new Context(Locale.getDefault());
            context.setVariable("user", user);
            context.setVariable("book", book);
            context.setVariable("action", action);
            
            String htmlContent = templateEngine.process("emails/book-notification", context);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(user.getEmail());
            helper.setSubject(String.format("Book %s Notification: %s", action, book.getTitle()));
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            log.info("Sent {} notification email to {} for book {}", action, user.getEmail(), book.getTitle());
        } catch (MessagingException e) {
            log.error("Failed to send book notification email to {}", user.getEmail(), e);
            throw new EmailException("Failed to send book notification email", e);
        }
    }

    public void sendDueDateReminder(User user, Book book, LocalDate dueDate) {
        try {
            Context context = new Context(Locale.getDefault());
            context.setVariable("user", user);
            context.setVariable("book", book);
            context.setVariable("dueDate", dueDate.format(DATE_FORMATTER));
            context.setVariable("daysRemaining", ChronoUnit.DAYS.between(LocalDate.now(), dueDate));
            
            String htmlContent = templateEngine.process("emails/due-date-reminder", context);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(user.getEmail());
            helper.setSubject(String.format("Reminder: %s Due Soon", book.getTitle()));
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            log.info("Sent due date reminder email to {} for book {}", user.getEmail(), book.getTitle());
        } catch (MessagingException e) {
            log.error("Failed to send due date reminder email to {}", user.getEmail(), e);
            throw new EmailException("Failed to send due date reminder email", e);
        }
    }

    public static class EmailException extends RuntimeException {
        public EmailException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}