package com.smartcampus.dto;

import com.smartcampus.model.enums.TicketStatus; // Enum representing ticket status (OPEN, IN_PROGRESS, CLOSED, etc.)
import jakarta.validation.constraints.NotNull; // Ensures the field is not null

public class UpdateTicketStatusRequest {

    //  New status to update the ticket
    @NotNull(message = "Status is required") // Must provide a status
    private TicketStatus status;

    // Default constructor
    public UpdateTicketStatusRequest() {
    }

    // Getter for status
    public TicketStatus getStatus() {
        return status;
    }

    // Setter for status
    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}