package com.smartcampus.model.entity;

import java.time.LocalDateTime;

public class TicketHistoryEntry {

    //  Type of action performed (e.g., CREATED, UPDATED, CLOSED)
    private String action;

    //  Message or note related to the action
    private String message;

    //  ID of the user/technician who performed the action
    private String performedBy;

    //  Time when the action was recorded (default = current time)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Default constructor
    public TicketHistoryEntry() {
    }

    // Constructor to set all values
    public TicketHistoryEntry(String action, String message, String performedBy, LocalDateTime createdAt) {
        this.action = action;
        this.message = message;
        this.performedBy = performedBy;
        this.createdAt = createdAt;
    }

    // Getter for action
    public String getAction() {
        return action;
    }

    // Setter for action
    public void setAction(String action) {
        this.action = action;
    }

    // Getter for message
    public String getMessage() {
        return message;
    }

    // Setter for message
    public void setMessage(String message) {
        this.message = message;
    }

    // Getter for performer ID
    public String getPerformedBy() {
        return performedBy;
    }

    // Setter for performer ID
    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    // Getter for created time
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setter for created time
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}