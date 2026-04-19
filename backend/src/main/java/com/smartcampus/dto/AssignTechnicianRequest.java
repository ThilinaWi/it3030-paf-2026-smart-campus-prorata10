package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTechnicianRequest {

    @NotBlank(message = "Technician ID is required")
    private String technicianId;

    public AssignTechnicianRequest() {
    }

    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }
}