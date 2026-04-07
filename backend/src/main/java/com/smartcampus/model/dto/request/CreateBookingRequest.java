package com.smartcampus.model.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * DTO for creating a new booking request.
 */
public class CreateBookingRequest {

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Cannot book in the past")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotNull(message = "Attendees list is required")
    @Size(min = 1, message = "At least one attendee is required")
    private List<String> attendees;

    public CreateBookingRequest() {}

    public CreateBookingRequest(String resourceId, LocalDate date, LocalTime startTime,
                                LocalTime endTime, String purpose, List<String> attendees) {
        this.resourceId = resourceId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.attendees = attendees;
    }

    // Getters and Setters
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
}
