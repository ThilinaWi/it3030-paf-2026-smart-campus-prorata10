package com.smartcampus.dto;

import jakarta.validation.constraints.*;

public class ResourceCreateDTO {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotNull(message = "Capacity is required")
    @Min(1)
    private Integer capacity;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String description;
    private String imageUrl;
    private String availabilityWindow;
    
    public ResourceCreateDTO() {}
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
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