package com.smartcampus.dto.response;

import com.smartcampus.model.enums.TicketCategory;
import com.smartcampus.model.enums.TicketPriority;
import com.smartcampus.model.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {

    private String id;
    private String userId;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String technicianId;
    private String technicianName;
    private List<String> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long timeToFirstResponseMinutes;
    private Long timeToResolutionMinutes;
    private List<TicketHistoryItemResponse> history;

    public TicketResponse() {
    }

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
                          LocalDateTime updatedAt,
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
        this.updatedAt = updatedAt;
        this.timeToFirstResponseMinutes = timeToFirstResponseMinutes;
        this.timeToResolutionMinutes = timeToResolutionMinutes;
        this.history = history;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
