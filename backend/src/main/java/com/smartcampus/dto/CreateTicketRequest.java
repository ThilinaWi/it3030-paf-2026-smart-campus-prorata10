package com.smartcampus.dto;

import com.smartcampus.model.enums.TicketCategory; // Enum for ticket category (e.g., IT, Maintenance, etc.)
import com.smartcampus.model.enums.TicketPriority; // Enum for priority (LOW, MEDIUM, HIGH)
import jakarta.validation.constraints.NotBlank; // Ensures field is not empty
import jakarta.validation.constraints.NotNull; // Ensures field is not null
import jakarta.validation.constraints.Size; // Used to limit length of text

public class CreateTicketRequest {

    // 🔹 Title of the ticket (short summary)
    @NotBlank(message = "Title is required") // Cannot be empty
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters") // Length validation
    private String title;

    // 🔹 Category of the issue (must select one)
    @NotNull(message = "Category is required")
    private TicketCategory category;

    // 🔹 Detailed description of the issue
    @NotBlank(message = "Description is required") // Cannot be empty
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters") // Must be meaningful
    private String description;

    // 🔹 Priority level of the ticket
    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    // Default constructor (needed for object creation)
    public CreateTicketRequest() {
    }

    // Getter for title
    public String getTitle() {
        return title;
    }

    // Setter for title
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter for category
    public TicketCategory getCategory() {
        return category;
    }

    // Setter for category
    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    // Getter for description
    public String getDescription() {
        return description;
    }

    // Setter for description
    public void setDescription(String description) {
        this.description = description;
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