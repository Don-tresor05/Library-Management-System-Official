package com.system.Library_Backend.repository;

import com.system.Library_Backend.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserId(Long userId);
    List<ActivityLog> findByActionType(String actionType);
    List<ActivityLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    List<ActivityLog> findByUserIdAndActionType(Long userId, String actionType);
}