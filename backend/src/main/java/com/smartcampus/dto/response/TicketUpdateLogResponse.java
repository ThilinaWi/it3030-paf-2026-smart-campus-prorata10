package com.smartcampus.dto.response;

import java.time.LocalDateTime;

public class TicketUpdateLogResponse {

    private String id;
    private String ticketId;
    private String technicianId;
    private String technicianName;
    private String message;
    private LocalDateTime createdAt;

    public TicketUpdateLogResponse() {
    }

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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
