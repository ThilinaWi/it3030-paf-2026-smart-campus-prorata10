package com.smartcampus.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.smartcampus.model.enums.ResourceType;

@Document(collection = "resources")
public class Resource {
    
    @Id
    private String id;
    
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String status;
    private Boolean isActive;
    private String description;
    private String imageUrl;
    private String availabilityWindow;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Resource() {}
    
    public Resource(String name, ResourceType type, Integer capacity, String location) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.status = "ACTIVE";
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public ResourceType getType() { return type; }
    public Integer getCapacity() { return capacity; }
    public String getLocation() { return location; }
    public String getStatus() { return status; }
    public boolean isActive() {
        if (isActive != null) {
            return isActive;
        }
        return "ACTIVE".equalsIgnoreCase(status);
    }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public String getAvailabilityWindow() { return availabilityWindow; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(ResourceType type) { this.type = type; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setLocation(String location) { this.location = location; }
    public void setStatus(String status) { this.status = status; }
    public void setActive(boolean active) { isActive = active; }
    public void setDescription(String description) { this.description = description; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setAvailabilityWindow(String availabilityWindow) { this.availabilityWindow = availabilityWindow; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}