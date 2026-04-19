package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;

public class AddTicketUpdateRequest {

    @NotBlank(message = "Update message is required")
    private String message;

    public AddTicketUpdateRequest() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
