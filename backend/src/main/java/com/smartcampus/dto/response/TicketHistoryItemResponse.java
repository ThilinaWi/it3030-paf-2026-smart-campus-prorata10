package com.smartcampus.dto.response;

import java.time.LocalDateTime;

public class TicketHistoryItemResponse {

    private String action;
    private String message;
    private String performedBy;
    private String performedByName;
    private String performedByRole;
    private LocalDateTime createdAt;

    public TicketHistoryItemResponse() {
    }

    public TicketHistoryItemResponse(String action,
                                     String message,
                                     String performedBy,
                                     String performedByName,
                                     String performedByRole,
                                     LocalDateTime createdAt) {
        this.action = action;
        this.message = message;
        this.performedBy = performedBy;
        this.performedByName = performedByName;
        this.performedByRole = performedByRole;
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

    public String getPerformedByName() {
        return performedByName;
    }

    public void setPerformedByName(String performedByName) {
        this.performedByName = performedByName;
    }

    public String getPerformedByRole() {
        return performedByRole;
    }

    public void setPerformedByRole(String performedByRole) {
        this.performedByRole = performedByRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}