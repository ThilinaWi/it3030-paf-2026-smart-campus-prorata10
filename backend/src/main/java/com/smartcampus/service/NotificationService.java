package com.smartcampus.service;

import com.smartcampus.model.enums.Role;
import com.smartcampus.model.entity.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.dto.request.CreateNotificationRequest;
import com.smartcampus.model.dto.response.NotificationDTO;
import com.smartcampus.model.enums.NotificationPreferenceCategory;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.model.entity.Notification;
import com.smartcampus.repository.NotificationRepository;
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
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
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
        User targetUser = userRepository.findById(request.getUserId()).orElse(null);
        NotificationPreferenceCategory category = request.getPreferenceCategory() != null
            ? request.getPreferenceCategory()
            : inferPreferenceCategory(request.getMessage());

        if (targetUser != null && !isPreferenceEnabled(targetUser, category)) {
            log.info("Skipping notification for user {} due to disabled preference {}",
                request.getUserId(), category);
            return null;
        }

        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());

        Notification saved = notificationRepository.save(notification);
        log.info("Created notification for user {}: {}", request.getUserId(), request.getMessage());
        return toDTO(saved);
    }

    /**
     * Create the same notification for every user in a target role.
     */
    public void createNotificationsForRole(Role role, NotificationType type, String message) {
        createNotificationsForRole(role, type, message, inferPreferenceCategory(message));
    }

    public void createNotificationsForRole(Role role,
                                           NotificationType type,
                                           String message,
                                           NotificationPreferenceCategory category) {
        List<User> targetUsers = userRepository.findAllByRole(role);

        if (targetUsers.isEmpty()) {
            log.warn("No users found with role {}. Skipping role-based notification: {}", role, message);
            return;
        }

        List<Notification> notifications = targetUsers.stream()
                .filter(user -> isPreferenceEnabled(user, category))
                .map(user -> {
            Notification notification = new Notification();
            notification.setUserId(user.getId());
            notification.setType(type);
            notification.setMessage(message);
            return notification;
        }).collect(Collectors.toList());

        if (notifications.isEmpty()) {
            log.info("No notifications sent for role {} because all targeted users disabled {}", role, category);
            return;
        }

        notificationRepository.saveAll(notifications);
        log.info("Created {} notifications for role {}", notifications.size(), role);
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

    private NotificationPreferenceCategory inferPreferenceCategory(String message) {
        String normalized = message == null ? "" : message.toLowerCase();

        if (normalized.contains("status updated") || normalized.contains("approved") || normalized.contains("rejected")) {
            return NotificationPreferenceCategory.STATUS_UPDATES;
        }

        if (normalized.contains("technician update") || normalized.contains("progress note") || normalized.contains("comment")) {
            return NotificationPreferenceCategory.TECHNICIAN_UPDATES;
        }

        if (normalized.contains("assigned")) {
            return NotificationPreferenceCategory.ASSIGNMENTS;
        }

        return NotificationPreferenceCategory.SYSTEM;
    }

    private boolean isPreferenceEnabled(User user, NotificationPreferenceCategory category) {
        User.NotificationPreferences preferences = user.getNotificationPreferences();

        return switch (category) {
            case STATUS_UPDATES -> preferences.isStatusUpdates();
            case TECHNICIAN_UPDATES -> preferences.isTechnicianUpdates();
            case ASSIGNMENTS -> preferences.isAssignments();
            case SYSTEM -> preferences.isSystem();
        };
    }
}
