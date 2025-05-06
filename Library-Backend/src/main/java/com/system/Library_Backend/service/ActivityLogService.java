package com.system.Library_Backend.service;

import com.system.Library_Backend.model.ActivityLog;
import com.system.Library_Backend.model.Book;
import com.system.Library_Backend.model.User;
import com.system.Library_Backend.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    public void logActivity(User user, Book book, String actionType) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setBook(book);
        log.setActionType(actionType);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getFilteredLogs(Long userId, String actionType, LocalDateTime start, LocalDateTime end) {
        if (userId != null && actionType != null) {
            return activityLogRepository.findByUserIdAndActionType(userId, actionType);
        } else if (userId != null) {
            return activityLogRepository.findByUserId(userId);
        } else if (actionType != null) {
            return activityLogRepository.findByActionType(actionType);
        } else if (start != null && end != null) {
            return activityLogRepository.findByTimestampBetween(start, end);
        }
        return activityLogRepository.findAll();
    }
}