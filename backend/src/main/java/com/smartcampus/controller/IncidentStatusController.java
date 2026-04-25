package com.smartcampus.controller;

import com.smartcampus.dto.UpdateTicketStatusRequest; // DTO for updating ticket status (e.g., OPEN → CLOSED)
import com.smartcampus.dto.UpdateIncidentRequest; // DTO for updating incident details (title, description, etc.)
import com.smartcampus.dto.response.TicketResponse; // Response object returned to frontend
import com.smartcampus.model.entity.User; // Logged-in user entity
import com.smartcampus.service.TicketService; // Service layer handling business logic
import jakarta.validation.Valid; // Used to validate request body
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Role-based access control
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Get logged-in user
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Marks this class as REST API controller
@RequestMapping("/api/incidents") // Base URL for all endpoints in this controller
public class IncidentStatusController {

    private final TicketService ticketService; // Service to handle ticket/incident logic

    // Constructor injection (Spring automatically provides TicketService)
    public IncidentStatusController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // 🔹 Update incident status (ADMIN or TECHNICIAN only)
    @PutMapping("/{id}/status") // Endpoint: PUT /api/incidents/{id}/status
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')") // Only ADMIN or TECHNICIAN can access
    public ResponseEntity<TicketResponse> updateIncidentStatus(
            @PathVariable String id, // Incident ID from URL
            @AuthenticationPrincipal User user, // Logged-in user
            @Valid @RequestBody UpdateTicketStatusRequest request // Request body with new status
    ) {
        // Call service layer to update status and return updated ticket
        return ResponseEntity.ok(
                ticketService.updateTicketStatus(id, user.getId(), user.getRole(), request)
        );
    }

    // 🔹 Update incident details (only USER who created it)
    @PutMapping("/{id}") // Endpoint: PUT /api/incidents/{id}
    @PreAuthorize("hasRole('USER')") // Only normal USER can update their incident
    public ResponseEntity<TicketResponse> updateIncident(
            @PathVariable String id, // Incident ID
            @AuthenticationPrincipal User user, // Logged-in user
            @Valid @RequestBody UpdateIncidentRequest request // Request body with updated data
    ) {
        // Call service to update incident details
        return ResponseEntity.ok(
                ticketService.updateIncident(id, user.getId(), request)
        );
    }

    // 🔹 Delete incident (only USER who created it)
    @DeleteMapping("/{id}") // Endpoint: DELETE /api/incidents/{id}
    @PreAuthorize("hasRole('USER')") // Only USER can delete their incident
    public ResponseEntity<Void> deleteIncident(
            @PathVariable String id, // Incident ID
            @AuthenticationPrincipal User user // Logged-in user
    ) {
        // Call service to delete incident
        ticketService.deleteIncident(id, user.getId());

        // Return HTTP 204 (No Content) → successful deletion
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}