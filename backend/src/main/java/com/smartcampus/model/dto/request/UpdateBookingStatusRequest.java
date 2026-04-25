package com.smartcampus.model.dto.request;

import com.smartcampus.model.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for updating booking status (approve/reject)..
 */
public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String reason;

    public UpdateBookingStatusRequest() {}

    public UpdateBookingStatusRequest(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
