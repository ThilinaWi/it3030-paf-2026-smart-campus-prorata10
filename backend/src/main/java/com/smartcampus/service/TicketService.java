package com.smartcampus.service;

import com.smartcampus.model.enums.Role; // User role (USER, ADMIN, TECHNICIAN)
import com.smartcampus.dto.AssignTechnicianRequest; // Request to assign technician
import com.smartcampus.dto.CreateTicketRequest; // Request to create ticket
import com.smartcampus.dto.UpdateIncidentRequest; // Request to update incident details
import com.smartcampus.dto.UpdateTicketStatusRequest; // Request to update status
import com.smartcampus.dto.response.AttachmentDownloadInfo; // File download info
import com.smartcampus.dto.response.TicketPageResponse; // Paginated ticket response
import com.smartcampus.dto.response.TicketResponse; // Main ticket response
import com.smartcampus.dto.response.TicketUpdateLogResponse; // Ticket update logs
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {

    //  Create a new ticket
    TicketResponse createTicket(String userId, CreateTicketRequest request);

    //  Get tickets created by a user
    List<TicketResponse> getMyTickets(String userId);

    //  Get all tickets (simple list)
    List<TicketResponse> getAllTickets();

    //  Get all tickets with pagination + filters
    TicketPageResponse getAllTickets(int page, int size, String search, String status, String category);

    //  Get tickets assigned to a technician
    List<TicketResponse> getAssignedTickets(String technicianId);

    //  Get a ticket by ID with access control
    TicketResponse getTicketById(String ticketId, String requesterId, Role requesterRole);

    //  Assign a technician to a ticket (ADMIN action)
    TicketResponse assignTechnician(String ticketId, AssignTechnicianRequest request, String adminId);

    //  Update ticket details (USER action)
    TicketResponse updateIncident(String ticketId, String requesterId, UpdateIncidentRequest request);

    //  Delete a ticket (soft delete)
    void deleteIncident(String ticketId, String requesterId);

    // Update ticket status (ADMIN / TECHNICIAN)
    TicketResponse updateTicketStatus(String ticketId, String requesterId, Role requesterRole, UpdateTicketStatusRequest request);

    // Add update message to a ticket (TECHNICIAN)
    TicketUpdateLogResponse addUpdateMessage(String ticketId, String technicianId, String message);

    // Upload attachment to ticket
    TicketResponse uploadAttachment(String ticketId, String requesterId, Role requesterRole, MultipartFile file);

    // Get file info for downloading attachment
    AttachmentDownloadInfo getAttachmentForDownload(String ticketId, String requesterId, Role requesterRole, String attachmentPath);

    // Get all updates/messages of a ticket
    List<TicketUpdateLogResponse> getTicketUpdates(String ticketId, String requesterId, Role requesterRole);
}