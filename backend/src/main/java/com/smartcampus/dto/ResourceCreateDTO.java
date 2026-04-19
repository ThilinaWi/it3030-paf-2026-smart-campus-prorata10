package com.smartcampus.dto;

import com.smartcampus.model.enums.ResourceType;
import jakarta.validation.constraints.*;

public class ResourceCreateDTO {
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 120, message = "Name must be between 3 and 120 characters")
    private String name;
    
    @NotNull(message = "Type is required")
    private ResourceType type;
    
    @NotNull(message = "Capacity is required")
    @Min(1)
    private Integer capacity;
    
    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 120, message = "Location must be between 2 and 120 characters")
    private String location;
    
    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;
    private String imageUrl;

    @Size(max = 120, message = "Availability window must be at most 120 characters")
    private String availabilityWindow;
    
    public ResourceCreateDTO() {}
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAvailabilityWindow() { return availabilityWindow; }
    public void setAvailabilityWindow(String availabilityWindow) { this.availabilityWindow = availabilityWindow; }
}