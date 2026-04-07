package com.smartcampus.dto;

public class ResourceUpdateDTO {
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String status;
    private String description;
    private String imageUrl;
    private String availabilityWindow;
    
    public ResourceUpdateDTO() {}
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
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