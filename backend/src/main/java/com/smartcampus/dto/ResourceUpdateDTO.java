package com.smartcampus.dto;

import com.smartcampus.model.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class ResourceUpdateDTO {
    @Size(min = 1, message = "Name cannot be blank")
    private String name;

    private ResourceType type;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    @Size(min = 1, message = "Location cannot be blank")
    private String location;

    private String status;
    private String description;
    private String imageUrl;
    private String availabilityWindow;
    
    public ResourceUpdateDTO() {}
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAvailabilityWindow() { return availabilityWindow; }
    public void setAvailabilityWindow(String availabilityWindow) { this.availabilityWindow = availabilityWindow; }
}