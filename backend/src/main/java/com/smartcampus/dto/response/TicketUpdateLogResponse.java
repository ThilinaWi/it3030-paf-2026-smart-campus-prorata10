package com.smartcampus.dto.response;

import java.time.LocalDateTime;

public class TicketUpdateLogResponse {

    //  Unique ID of this update log
    private String id;

    // Related ticket ID (which ticket this update belongs to)
    private String ticketId;

    //  Technician who added the update
    private String technicianId;

    //  Technician name (for display in frontend)
    private String technicianName;

    //  Message or update description added by technician
    private String message;

    //  Time when this update was created
    private LocalDateTime createdAt;

    // Default constructor
    public TicketUpdateLogResponse() {
    }

    // Constructor to set all values
    public TicketUpdateLogResponse(String id,
                                   String ticketId,
                                   String technicianId,
                                   String technicianName,
                                   String message,
                                   LocalDateTime createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.message = message;
        this.createdAt = createdAt;
    }

    // Getter for log ID
    public String getId() {
        return id;
    }

    // Setter for log ID
    public void setId(String id) {
        this.id = id;
    }

    // Getter for ticket ID
    public String getTicketId() {
        return ticketId;
    }

    // Setter for ticket ID
    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    // Getter for technician ID
    public String getTechnicianId() {
        return technicianId;
    }

    // Setter for technician ID
    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }

    // Getter for technician name
    public String getTechnicianName() {
        return technicianName;
    }

    // Setter for technician name
    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }

    // Getter for update message
    public String getMessage() {
        return message;
    }

    // Setter for update message
    public void setMessage(String message) {
        this.message = message;
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