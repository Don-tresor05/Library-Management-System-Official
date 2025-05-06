package com.system.Library_Backend.controller;

import com.system.Library_Backend.model.ActivityLog;
import com.system.Library_Backend.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogService activityLogService;

    @GetMapping
    public List<ActivityLog> getActivityLogs(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) String actionType,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return activityLogService.getFilteredLogs(userId, actionType, start, end);
    }
}