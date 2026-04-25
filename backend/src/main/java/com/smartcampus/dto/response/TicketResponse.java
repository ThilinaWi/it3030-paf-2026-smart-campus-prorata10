package com.smartcampus.dto.response;

import com.smartcampus.model.enums.TicketCategory; // Category of the ticket
import com.smartcampus.model.enums.TicketPriority; // Priority level
import com.smartcampus.model.enums.TicketStatus; // Current status

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {

    //  Basic ticket details
    private String id; // Ticket ID
    private String userId; // User who created the ticket
    private String title; // Short title of the issue
    private String description; // Detailed explanation

    //  Ticket classification
    private TicketCategory category; // Type of issue
    private TicketPriority priority; // Urgency level
    private TicketStatus status; // Current status (OPEN, CLOSED, etc.)

    //  Technician details
    private String technicianId; // Assigned technician ID
    private String technicianName; // Assigned technician name

    //  Attachments (file paths or names)
    private List<String> attachments;

    //  Time tracking
    private LocalDateTime createdAt; // When ticket was created
    private LocalDateTime firstResponseAt; // First response time
    private LocalDateTime resolvedAt; // When resolved
    private LocalDateTime updatedAt; // Last updated time

    //  Calculated time info
    private String resolutionTime; // Human-readable resolution time
    private Long timeToFirstResponseMinutes; // Minutes to first response
    private Long timeToResolutionMinutes; // Total resolution time in minutes

    //  History of updates/messages
    private List<TicketHistoryItemResponse> history;

    public TicketResponse() {
    }

    // Constructor to set all values
    public TicketResponse(String id,
                          String userId,
                          String title,
                          String description,
                          TicketCategory category,
                          TicketPriority priority,
                          TicketStatus status,
                          String technicianId,
                          String technicianName,
                          List<String> attachments,
                          LocalDateTime createdAt,
                          LocalDateTime firstResponseAt,
                          LocalDateTime resolvedAt,
                          LocalDateTime updatedAt,
                          String resolutionTime,
                          Long timeToFirstResponseMinutes,
                          Long timeToResolutionMinutes,
                          List<TicketHistoryItemResponse> history) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.attachments = attachments;
        this.createdAt = createdAt;
        this.firstResponseAt = firstResponseAt;
        this.resolvedAt = resolvedAt;
        this.updatedAt = updatedAt;
        this.resolutionTime = resolutionTime;
        this.timeToFirstResponseMinutes = timeToFirstResponseMinutes;
        this.timeToResolutionMinutes = timeToResolutionMinutes;
        this.history = history;
    }


}