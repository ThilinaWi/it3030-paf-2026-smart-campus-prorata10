package com.smartcampus.service;

import com.smartcampus.model.enums.Role;
import com.smartcampus.dto.AssignTechnicianRequest;
import com.smartcampus.dto.CreateTicketRequest;
import com.smartcampus.dto.UpdateIncidentRequest;
import com.smartcampus.dto.UpdateTicketStatusRequest;
import com.smartcampus.dto.response.AttachmentDownloadInfo;
import com.smartcampus.dto.response.TicketPageResponse;
import com.smartcampus.dto.response.TicketResponse;
import com.smartcampus.dto.response.TicketUpdateLogResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {

    TicketResponse createTicket(String userId, CreateTicketRequest request);

    List<TicketResponse> getMyTickets(String userId);

    List<TicketResponse> getAllTickets();

    TicketPageResponse getAllTickets(int page, int size, String search, String status, String category);

    List<TicketResponse> getAssignedTickets(String technicianId);

    TicketResponse getTicketById(String ticketId, String requesterId, Role requesterRole);

    TicketResponse assignTechnician(String ticketId, AssignTechnicianRequest request, String adminId);

    TicketResponse updateIncident(String ticketId, String requesterId, UpdateIncidentRequest request);

    void deleteIncident(String ticketId, String requesterId);

    TicketResponse updateTicketStatus(String ticketId, String requesterId, Role requesterRole, UpdateTicketStatusRequest request);

    TicketUpdateLogResponse addUpdateMessage(String ticketId, String technicianId, String message);

    TicketResponse uploadAttachment(String ticketId, String requesterId, Role requesterRole, MultipartFile file);

    AttachmentDownloadInfo getAttachmentForDownload(String ticketId, String requesterId, Role requesterRole, String attachmentPath);

    List<TicketUpdateLogResponse> getTicketUpdates(String ticketId, String requesterId, Role requesterRole);
}
