package com.smartcampus.dto;

import com.smartcampus.model.enums.TicketCategory; // Category type of the ticket
import com.smartcampus.model.enums.TicketPriority; // Priority level (LOW, MEDIUM, HIGH)
import jakarta.validation.constraints.NotBlank; // Ensures field is not empty
import jakarta.validation.constraints.NotNull; // Ensures field is not null
import jakarta.validation.constraints.Size; // Used to limit text length

public class UpdateIncidentRequest {

    //  Updated title of the incident
    @NotBlank(message = "Title is required") // Cannot be empty
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
    private String title;

    //  Updated description of the incident
    @NotBlank(message = "Description is required") // Cannot be empty
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    //  Updated category (must select one)
    @NotNull(message = "Category is required")
    private TicketCategory category;

    // Updated priority level
    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    // Default constructor
    public UpdateIncidentRequest() {
    }

    // Getter for title
    public String getTitle() {
        return title;
    }

    // Setter for title
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter for description
    public String getDescription() {
        return description;
    }

    // Setter for description
    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for category
    public TicketCategory getCategory() {
        return category;
    }

    // Setter for category
    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    // Getter for priority
    public TicketPriority getPriority() {
        return priority;
    }

    // Setter for priority
    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }
}