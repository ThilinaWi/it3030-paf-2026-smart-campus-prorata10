package com.smartcampus.ticket.service;

import com.smartcampus.ticket.dto.AddCommentRequest;
import com.smartcampus.ticket.dto.AssignTechnicianRequest;
import com.smartcampus.ticket.dto.CreateTicketRequest;
import com.smartcampus.ticket.dto.UpdateTicketStatusRequest;
import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.entity.TicketAttachment;
import com.smartcampus.ticket.entity.TicketComment;
import com.smartcampus.ticket.enums.TicketStatus;
import com.smartcampus.ticket.repository.TicketAttachmentRepository;
import com.smartcampus.ticket.repository.TicketCommentRepository;
import com.smartcampus.ticket.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final TicketCommentRepository ticketCommentRepository;

    public TicketService(
            TicketRepository ticketRepository,
            TicketAttachmentRepository ticketAttachmentRepository,
            TicketCommentRepository ticketCommentRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.ticketAttachmentRepository = ticketAttachmentRepository;
        this.ticketCommentRepository = ticketCommentRepository;
    }

    public Ticket createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setCreatedBy(request.getCreatedBy());
        ticket.setStatus(TicketStatus.OPEN);

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public Ticket assignTechnician(Long ticketId, AssignTechnicianRequest request) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedTechnician(request.getTechnicianName());
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(Long ticketId, UpdateTicketStatusRequest request) {
        Ticket ticket = getTicketById(ticketId);

        TicketStatus currentStatus = ticket.getStatus();
        TicketStatus newStatus = request.getStatus();

        if (currentStatus == TicketStatus.OPEN && newStatus == TicketStatus.IN_PROGRESS) {
            ticket.setStatus(newStatus);
        } else if (currentStatus == TicketStatus.IN_PROGRESS && newStatus == TicketStatus.RESOLVED) {
            ticket.setStatus(newStatus);
        } else if (currentStatus == TicketStatus.RESOLVED && newStatus == TicketStatus.CLOSED) {
            ticket.setStatus(newStatus);
        } else if (newStatus == TicketStatus.REJECTED) {
            ticket.setStatus(TicketStatus.REJECTED);
            ticket.setRejectionReason(request.getRejectionReason());
        } else {
            throw new RuntimeException("Invalid ticket status transition from " + currentStatus + " to " + newStatus);
        }

        if (request.getResolutionNotes() != null && !request.getResolutionNotes().isBlank()) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }

        return ticketRepository.save(ticket);
    }

    public TicketComment addComment(Long ticketId, AddCommentRequest request) {
        Ticket ticket = getTicketById(ticketId);

        TicketComment comment = new TicketComment();
        comment.setCommentText(request.getCommentText());
        comment.setCommentedBy(request.getCommentedBy());
        comment.setTicket(ticket);

        return ticketCommentRepository.save(comment);
    }

    public List<TicketComment> getCommentsByTicketId(Long ticketId) {
        return ticketCommentRepository.findByTicketId(ticketId);
    }

    public void deleteComment(Long commentId, String requestedBy) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getCommentedBy().equalsIgnoreCase(requestedBy)) {
            throw new RuntimeException("You can only delete your own comment");
        }

        ticketCommentRepository.delete(comment);
    }

    public TicketAttachment uploadAttachment(Long ticketId, MultipartFile file) throws IOException {
        Ticket ticket = getTicketById(ticketId);

        long attachmentCount = ticketAttachmentRepository.countByTicketId(ticketId);
        if (attachmentCount >= 3) {
            throw new RuntimeException("Maximum 3 attachments allowed per ticket");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        String uploadDir = "uploads/tickets/";
        Files.createDirectories(Paths.get(uploadDir));

        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, uniqueFileName);
        Files.write(filePath, file.getBytes());

        TicketAttachment attachment = new TicketAttachment();
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileType(contentType);
        attachment.setFilePath(filePath.toString());
        attachment.setTicket(ticket);

        return ticketAttachmentRepository.save(attachment);
    }

    public List<TicketAttachment> getAttachmentsByTicketId(Long ticketId) {
        return ticketAttachmentRepository.findByTicketId(ticketId);
    }
}