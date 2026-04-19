package com.smartcampus.controller;

import com.smartcampus.model.entity.User;
import com.smartcampus.dto.AddTicketUpdateRequest;
import com.smartcampus.dto.AssignTechnicianRequest;
import com.smartcampus.dto.CreateTicketRequest;
import com.smartcampus.dto.UpdateTicketStatusRequest;
import com.smartcampus.dto.response.AttachmentDownloadInfo;
import com.smartcampus.dto.response.TicketPageResponse;
import com.smartcampus.dto.response.TicketResponse;
import com.smartcampus.dto.response.TicketUpdateLogResponse;
import com.smartcampus.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(user.getId(), request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TicketResponse>> getMyTickets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.getMyTickets(user.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ticketService.getTicketById(id, user.getId(), user.getRole()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketPageResponse> getAllTickets(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "ALL") String category
    ) {
        return ResponseEntity.ok(ticketService.getAllTickets(page, size, search, status, category));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AssignTechnicianRequest request
    ) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, request, user.getId()));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getAssignedTickets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(user.getId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTicketStatusRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, user.getId(), user.getRole(), request));
    }

    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','ADMIN')")
    public ResponseEntity<TicketResponse> uploadAttachment(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(ticketService.uploadAttachment(id, user.getId(), user.getRole(), file));
    }

    @GetMapping("/{id}/attachments/download")
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','ADMIN')")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @RequestParam("path") String path
    ) {
        AttachmentDownloadInfo info = ticketService.getAttachmentForDownload(id, user.getId(), user.getRole(), path);
        Resource resource = new FileSystemResource(info.getFilePath());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + info.getFileName() + "\"")
                .body(resource);
    }

    @PostMapping("/{id}/updates")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TicketUpdateLogResponse> addUpdateMessage(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddTicketUpdateRequest request
    ) {
        return ResponseEntity.ok(ticketService.addUpdateMessage(id, user.getId(), request.getMessage()));
    }

    @GetMapping("/{id}/updates")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<List<TicketUpdateLogResponse>> getTicketUpdates(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ticketService.getTicketUpdates(id, user.getId(), user.getRole()));
    }
}