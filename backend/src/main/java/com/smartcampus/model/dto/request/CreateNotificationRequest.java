package com.smartcampus.model.dto.request;

import com.smartcampus.model.enums.NotificationPreferenceCategory;
import com.smartcampus.model.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateNotificationRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Message is required")
    private String message;

    private NotificationPreferenceCategory preferenceCategory;

    public CreateNotificationRequest() {}

    public CreateNotificationRequest(String userId, NotificationType type, String message) {
        this.userId = userId;
        this.type = type;
        this.message = message;
    }

    public CreateNotificationRequest(String userId,
                                     NotificationType type,
                                     String message,
                                     NotificationPreferenceCategory preferenceCategory) {
        this.userId = userId;
        this.type = type;
        this.message = message;
        this.preferenceCategory = preferenceCategory;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationPreferenceCategory getPreferenceCategory() { return preferenceCategory; }
    public void setPreferenceCategory(NotificationPreferenceCategory preferenceCategory) {
        this.preferenceCategory = preferenceCategory;
    }
}
