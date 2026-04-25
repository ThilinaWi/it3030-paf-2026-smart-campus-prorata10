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

    //  Getters & Setters (standard Java methods)

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
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

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getResolutionTime() {
        return resolutionTime;
    }

    public void setResolutionTime(String resolutionTime) {
        this.resolutionTime = resolutionTime;
    }

    public Long getTimeToFirstResponseMinutes() {
        return timeToFirstResponseMinutes;
    }

    public void setTimeToFirstResponseMinutes(Long timeToFirstResponseMinutes) {
        this.timeToFirstResponseMinutes = timeToFirstResponseMinutes;
    }

    public Long getTimeToResolutionMinutes() {
        return timeToResolutionMinutes;
    }

    public void setTimeToResolutionMinutes(Long timeToResolutionMinutes) {
        this.timeToResolutionMinutes = timeToResolutionMinutes;
    }

    public List<TicketHistoryItemResponse> getHistory() {
        return history;
    }

    public void setHistory(List<TicketHistoryItemResponse> history) {
        this.history = history;
    }
}