package com.smartcampus.model.entity;

import java.time.LocalDateTime;

public class TicketHistoryEntry {

    private String action;
    private String message;
    private String performedBy;
    private LocalDateTime createdAt = LocalDateTime.now();

    public TicketHistoryEntry() {
    }

    public TicketHistoryEntry(String action, String message, String performedBy, LocalDateTime createdAt) {
        this.action = action;
        this.message = message;
        this.performedBy = performedBy;
        this.createdAt = createdAt;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}