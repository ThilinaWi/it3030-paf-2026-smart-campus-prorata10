package com.smartcampus.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "incident_ticket_updates") // MongoDB collection for ticket updates
public class TicketUpdateLog {

    @Id
    private String id; // Unique ID for each update log

    private String ticketId; // ID of the related ticket

    private String technicianId; // Technician who added the update

    private String message; // Update message/content

    private LocalDateTime createdAt; // Time when the update was created

    public TicketUpdateLog() {
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