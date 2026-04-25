package com.smartcampus.dto.response;

import java.time.LocalDateTime;

public class TicketHistoryItemResponse {

    //  Type of action performed (e.g., CREATED, UPDATED, CLOSED)
    private String action;

    //  Message or description related to the action
    private String message;

    //  ID of the user/technician who performed the action
    private String performedBy;

    //  Name of the person who performed the action (for display)
    private String performedByName;

    //  Role of the person (USER / ADMIN / TECHNICIAN)
    private String performedByRole;

    //  Time when the action was performed
    private LocalDateTime createdAt;

    // Default constructor
    public TicketHistoryItemResponse() {
    }

    // Constructor to set all values
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

    // Getter for performedBy (user/technician ID)
    public String getPerformedBy() {
        return performedBy;
    }

    // Setter for performedBy
    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    // Getter for performer name
    public String getPerformedByName() {
        return performedByName;
    }

    // Setter for performer name
    public void setPerformedByName(String performedByName) {
        this.performedByName = performedByName;
    }


    }

    // Setter for created time
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}