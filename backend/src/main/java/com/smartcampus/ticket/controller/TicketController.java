package com.smartcampus.ticket.controller;

import com.smartcampus.ticket.dto.AddCommentRequest;
import com.smartcampus.ticket.dto.AssignTechnicianRequest;
import com.smartcampus.ticket.dto.CreateTicketRequest;
import com.smartcampus.ticket.dto.UpdateTicketStatusRequest;
import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.entity.TicketAttachment;
import com.smartcampus.ticket.entity.TicketComment;
import com.smartcampus.ticket.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        return ResponseEntity.ok(ticketService.createTicket(request));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody AssignTechnicianRequest request
    ) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request));
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<TicketAttachment> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(ticketService.uploadAttachment(id, file));
    }

    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<TicketAttachment>> getAttachmentsByTicketId(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getAttachmentsByTicketId(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(
            @PathVariable Long id,
            @Valid @RequestBody AddCommentRequest request
    ) {
        return ResponseEntity.ok(ticketService.addComment(id, request));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketComment>> getCommentsByTicketId(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getCommentsByTicketId(id));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @RequestParam String requestedBy
    ) {
        ticketService.deleteComment(commentId, requestedBy);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}