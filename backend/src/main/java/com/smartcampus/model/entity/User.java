package com.smartcampus.model.entity;

import com.smartcampus.model.enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * MongoDB document representing a user in the Smart Campus system.
 */
@Document(collection = "users")
public class User {

    public static class NotificationPreferences {
        private boolean statusUpdates = true;
        private boolean technicianUpdates = true;
        private boolean assignments = true;
        private boolean system = true;

        public NotificationPreferences() {
        }

        public boolean isStatusUpdates() {
            return statusUpdates;
        }

        public void setStatusUpdates(boolean statusUpdates) {
            this.statusUpdates = statusUpdates;
        }

        public boolean isTechnicianUpdates() {
            return technicianUpdates;
        }

        public void setTechnicianUpdates(boolean technicianUpdates) {
            this.technicianUpdates = technicianUpdates;
        }

        public boolean isAssignments() {
            return assignments;
        }

        public void setAssignments(boolean assignments) {
            this.assignments = assignments;
        }

        public boolean isSystem() {
            return system;
        }

        public void setSystem(boolean system) {
            this.system = system;
        }
    }

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String profilePicture;

    private Role role = Role.USER;

    private String provider = "GOOGLE";

    private LocalDateTime createdAt = LocalDateTime.now();

    private NotificationPreferences notificationPreferences = new NotificationPreferences();

    public User() {}

    public User(String id, String name, String email, String profilePicture, Role role, String provider, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
        this.role = role;
        this.provider = provider;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public NotificationPreferences getNotificationPreferences() {
        if (notificationPreferences == null) {
            notificationPreferences = new NotificationPreferences();
        }
        return notificationPreferences;
    }

    public void setNotificationPreferences(NotificationPreferences notificationPreferences) {
        this.notificationPreferences = notificationPreferences;
    }
}
