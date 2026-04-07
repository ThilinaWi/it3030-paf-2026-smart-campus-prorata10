package com.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTechnicianRequest {

    @NotBlank(message = "Technician name is required")
    private String technicianName;

    public AssignTechnicianRequest() {
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }
}