package com.smartcampus.controller;

import com.smartcampus.dto.UpdateTicketStatusRequest;
import com.smartcampus.dto.UpdateIncidentRequest;
import com.smartcampus.dto.response.TicketResponse;
import com.smartcampus.model.entity.User;
import com.smartcampus.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/incidents")
public class IncidentStatusController {

    private final TicketService ticketService;

    public IncidentStatusController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateIncidentStatus(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTicketStatusRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, user.getId(), user.getRole(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TicketResponse> updateIncident(
            @PathVariable String id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateIncidentRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateIncident(id, user.getId(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteIncident(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        ticketService.deleteIncident(id, user.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
