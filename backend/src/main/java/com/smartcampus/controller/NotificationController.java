package com.smartcampus.controller;

import com.smartcampus.model.entity.User;
import com.smartcampus.model.dto.response.NotificationDTO;
import com.smartcampus.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for notification endpoints.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Get all notifications for the authenticated user.
     * GET /api/notifications
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(
            @AuthenticationPrincipal User user) {
        List<NotificationDTO> notifications = notificationService.getUserNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notification count for the authenticated user.
     * GET /api/notifications/unread-count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal User user) {
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Mark a specific notification as read.
     * PATCH /api/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        NotificationDTO notification = notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(notification);
    }

    /**
     * Mark all notifications as read for the authenticated user.
     * PATCH /api/notifications/read-all
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.noContent().build();
    }
}
