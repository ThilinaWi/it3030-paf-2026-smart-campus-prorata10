package com.smartcampus.dto;

import jakarta.validation.constraints.NotNull;

public class ResourceStatusUpdateDTO {

    @NotNull(message = "isActive is required")
    private Boolean isActive;

    public ResourceStatusUpdateDTO() {}

    public Boolean getIsActive() {
        return isActive;
    }


    public void setIsActive(Boolean active) {
        isActive = active;
    }

    
}
