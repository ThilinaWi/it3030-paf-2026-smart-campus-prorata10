package com.smartcampus.controller;

import com.smartcampus.model.entity.User; // Logged-in user entity
import com.smartcampus.dto.AddTicketUpdateRequest; // DTO for adding update message
import com.smartcampus.dto.AssignTechnicianRequest; // DTO for assigning technician
import com.smartcampus.dto.CreateTicketRequest; // DTO for creating ticket
import com.smartcampus.dto.UpdateTicketStatusRequest; // DTO for updating status
import com.smartcampus.dto.response.AttachmentDownloadInfo; // Info for downloading file
import com.smartcampus.dto.response.TicketPageResponse; // Paginated ticket response
import com.smartcampus.dto.response.TicketResponse; // Main ticket response
import com.smartcampus.dto.response.TicketUpdateLogResponse; // Ticket update logs
import com.smartcampus.service.TicketService; // Business logic layer
import jakarta.validation.Valid; // For validating request data
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Role-based access
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Get logged user
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController // Marks this as a REST API controller
@RequestMapping("/api/tickets") // Base URL for all ticket-related endpoints
public class TicketController {

    private final TicketService ticketService; // Service layer

    // Constructor injection
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Create a new ticket (only USER can create)
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request, // Ticket data from frontend
            @AuthenticationPrincipal User user // Logged-in user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(user.getId(), request));
    }

    // Get tickets created by logged-in user
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TicketResponse>> getMyTickets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.getMyTickets(user.getId()));
    }

    //  Get a specific ticket by ID (accessible to all roles)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable String id, // Ticket ID
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                ticketService.getTicketById(id, user.getId(), user.getRole())
        );
    }

    //  Get all tickets (ADMIN only, with pagination + filters)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketPageResponse> getAllTickets(
            @RequestParam(defaultValue = "1") int page, // Page number
            @RequestParam(defaultValue = "6") int size, // Page size
            @RequestParam(required = false, defaultValue = "") String search, // Search keyword
            @RequestParam(required = false, defaultValue = "ALL") String status, // Filter by status
            @RequestParam(required = false, defaultValue = "ALL") String category // Filter by category
    ) {
        return ResponseEntity.ok(
                ticketService.getAllTickets(page, size, search, status, category)
        );
    }

    //  Assign technician to a ticket (ADMIN only)
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AssignTechnicianRequest request
    ) {
        return ResponseEntity.ok(
                ticketService.assignTechnician(id, request, user.getId())
        );
    }

    //  Get tickets assigned to technician
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getAssignedTickets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(user.getId()));
    }

    //  Update ticket status (ADMIN or TECHNICIAN)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTicketStatusRequest request
    ) {
        return ResponseEntity.ok(
                ticketService.updateTicketStatus(id, user.getId(), user.getRole(), request)
        );
    }

    //  Upload file attachment to a ticket
    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','ADMIN')")
    public ResponseEntity<TicketResponse> uploadAttachment(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file // File uploaded from frontend
    ) {
        return ResponseEntity.ok(
                ticketService.uploadAttachment(id, user.getId(), user.getRole(), file)
        );
    }

    //  Download attachment from a ticket
    @GetMapping("/{id}/attachments/download")
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','ADMIN')")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @RequestParam("path") String path // File path to download
    ) {
        AttachmentDownloadInfo info = ticketService.getAttachmentForDownload(
                id, user.getId(), user.getRole(), path
        );

        Resource resource = new FileSystemResource(info.getFilePath());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM) // File type
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + info.getFileName() + "\"") // Download name
                .body(resource);
    }

    //  Add update message (only TECHNICIAN)
    @PostMapping("/{id}/updates")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TicketUpdateLogResponse> addUpdateMessage(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddTicketUpdateRequest request
    ) {
        return ResponseEntity.ok(
                ticketService.addUpdateMessage(id, user.getId(), request.getMessage())
        );
    }

    //  Get all update messages of a ticket
    @GetMapping("/{id}/updates")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<List<TicketUpdateLogResponse>> getTicketUpdates(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                ticketService.getTicketUpdates(id, user.getId(), user.getRole())
        );
    }
}