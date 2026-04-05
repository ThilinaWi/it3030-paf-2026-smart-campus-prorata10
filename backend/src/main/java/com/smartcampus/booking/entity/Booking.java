package com.smartcampus.booking.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * MongoDB document representing a resource booking in the Smart Campus system.
 */
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String resourceId;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private String purpose;

    private List<String> attendees;

    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {}

    public Booking(String id, String userId, String resourceId, LocalDate date,
                   LocalTime startTime, LocalTime endTime, String purpose,
                   List<String> attendees, BookingStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.resourceId = resourceId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.attendees = attendees;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public List<String> getAttendees() { return attendees; }
    public void setAttendees(List<String> attendees) { this.attendees = attendees; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
