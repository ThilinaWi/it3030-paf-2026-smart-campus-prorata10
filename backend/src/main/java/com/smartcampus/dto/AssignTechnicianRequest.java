package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank; // Ensures the field is not empty

public class AssignTechnicianRequest {

    //  ID of the technician to be assigned to the ticket
    @NotBlank(message = "Technician ID is required") // Must provide technician ID
    private String technicianId;

    // Default constructor
    public AssignTechnicianRequest() {
    }

    // Getter for technician ID
    public String getTechnicianId() {
        return technicianId;
    }

    // Setter for technician ID
    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }
}