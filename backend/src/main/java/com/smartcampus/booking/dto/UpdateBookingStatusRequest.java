package com.smartcampus.booking.dto;

import com.smartcampus.booking.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for updating booking status (approve/reject).
 */
public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    public UpdateBookingStatusRequest() {}

    public UpdateBookingStatusRequest(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
