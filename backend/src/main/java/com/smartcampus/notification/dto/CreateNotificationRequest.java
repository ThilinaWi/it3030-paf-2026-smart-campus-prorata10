package com.smartcampus.notification.dto;

import com.smartcampus.notification.model.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a new notification.
 */
public class CreateNotificationRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Message is required")
    private String message;

    public CreateNotificationRequest() {}

    public CreateNotificationRequest(String userId, NotificationType type, String message) {
        this.userId = userId;
        this.type = type;
        this.message = message;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
