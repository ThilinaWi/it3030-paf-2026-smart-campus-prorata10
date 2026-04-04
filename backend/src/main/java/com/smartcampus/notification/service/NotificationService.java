package com.smartcampus.notification.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.notification.dto.CreateNotificationRequest;
import com.smartcampus.notification.dto.NotificationDTO;
import com.smartcampus.notification.model.Notification;
import com.smartcampus.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling notification business logic.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Get all notifications for a specific user, ordered by creation date descending.
     */
    public List<NotificationDTO> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notifications for a specific user.
     */
    public List<NotificationDTO> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get the count of unread notifications for a user.
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Mark a specific notification as read.
     */
    public NotificationDTO markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification", "id", notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        log.info("Notification {} marked as read for user {}", notificationId, userId);
        return toDTO(updated);
    }

    /**
     * Mark all notifications as read for a user.
     */
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        log.info("All notifications marked as read for user {}", userId);
    }

    /**
     * Create a new notification.
     */
    public NotificationDTO createNotification(CreateNotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());

        Notification saved = notificationRepository.save(notification);
        log.info("Created notification for user {}: {}", request.getUserId(), request.getMessage());
        return toDTO(saved);
    }

    /**
     * Convert Notification entity to NotificationDTO.
     */
    private NotificationDTO toDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getUserId(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
