package com.smartcampus.model.entity;

import com.smartcampus.model.enums.TicketCategory; // Ticket category (IT, Maintenance, etc.)
import com.smartcampus.model.enums.TicketPriority; // Priority level
import com.smartcampus.model.enums.TicketStatus; // Current status
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "incident_tickets") // MongoDB collection name
public class Ticket {

    @Id
    private String id; // Unique ticket ID

    private String userId; // User who created the ticket

    private String title; // Short title of the issue

    private TicketCategory category; // Type of issue

    private String description; // Detailed explanation

    private TicketPriority priority; // Urgency level

    private TicketStatus status; // Current status (OPEN, CLOSED, etc.)

    private String technicianId; // Assigned technician ID

    private List<String> attachments = new ArrayList<>(); // List of file attachments

    private List<TicketHistoryEntry> history = new ArrayList<>(); // History of actions on this ticket

    private LocalDateTime createdAt; // When ticket was created

    private LocalDateTime updatedAt; // Last updated time

    private LocalDateTime firstResponseAt; // First response time

    private LocalDateTime resolvedAt; // When ticket was resolved

    private boolean isDeleted = false; // Soft delete flag

    public Ticket() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getFirstResponseAt() {
        return firstResponseAt;
    }

    public void setFirstResponseAt(LocalDateTime firstResponseAt) {
        this.firstResponseAt = firstResponseAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public List<TicketHistoryEntry> getHistory() {
        return history;
    }

    public void setHistory(List<TicketHistoryEntry> history) {
        this.history = history;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    //  Calculate time taken for first response (in minutes)
    public Long getTimeToFirstResponseMinutes() {
        if (createdAt == null || firstResponseAt == null) {
            return null;
        }
        return Duration.between(createdAt, firstResponseAt).toMinutes();
    }

    //  Calculate total time taken to resolve ticket (in minutes)
    public Long getTimeToResolutionMinutes() {
        if (createdAt == null || resolvedAt == null) {
            return null;
        }
        return Duration.between(createdAt, resolvedAt).toMinutes();
    }
}