package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank; // Ensures the message is not empty

public class AddTicketUpdateRequest {

    //  Message added by technician as an update to the ticket
    @NotBlank(message = "Update message is required") // Cannot be empty
    private String message;

    // Default constructor
    public AddTicketUpdateRequest() {
    }

    // Getter for message
    public String getMessage() {
        return message;
    }

    // Setter for message
    public void setMessage(String message) {
        this.message = message;
    }
}