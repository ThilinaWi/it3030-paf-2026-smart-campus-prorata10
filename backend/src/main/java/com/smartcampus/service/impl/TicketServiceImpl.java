package com.smartcampus.service.impl;

import com.smartcampus.exception.ForbiddenOperationException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.dto.request.CreateNotificationRequest;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.model.enums.Role;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationService;
import com.smartcampus.dto.AssignTechnicianRequest;
import com.smartcampus.dto.CreateTicketRequest;
import com.smartcampus.dto.UpdateIncidentRequest;
import com.smartcampus.dto.UpdateTicketStatusRequest;
import com.smartcampus.dto.response.AttachmentDownloadInfo;
import com.smartcampus.dto.response.TicketHistoryItemResponse;
import com.smartcampus.dto.response.TicketPageResponse;
import com.smartcampus.dto.response.TicketResponse;
import com.smartcampus.dto.response.TicketUpdateLogResponse;
import com.smartcampus.model.entity.TicketHistoryEntry;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.entity.TicketUpdateLog;
import com.smartcampus.model.enums.NotificationPreferenceCategory;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.TicketUpdateLogRepository;
import com.smartcampus.service.TicketService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class TicketServiceImpl implements TicketService {

    private static final long MAX_ATTACHMENT_SIZE_BYTES = 5L * 1024L * 1024L;

    private final TicketRepository ticketRepository;
    private final TicketUpdateLogRepository ticketUpdateLogRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TicketServiceImpl(TicketRepository ticketRepository,
                             TicketUpdateLogRepository ticketUpdateLogRepository,
                             UserRepository userRepository,
                             NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.ticketUpdateLogRepository = ticketUpdateLogRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public TicketResponse createTicket(String userId, CreateTicketRequest request) {
        LocalDateTime now = LocalDateTime.now();

        Ticket ticket = new Ticket();
        ticket.setUserId(userId);
        ticket.setTitle(request.getTitle().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setAttachments(new ArrayList<>());
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);
        addHistoryEntry(ticket, "CREATED", "Incident created", userId);

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotificationsForRole(
                Role.ADMIN,
                NotificationType.ALERT,
            "New incident ticket created: " + saved.getTitle(),
            NotificationPreferenceCategory.SYSTEM
        );

        return toResponse(saved);
    }

    @Override
    public List<TicketResponse> getMyTickets(String userId) {
        return ticketRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findByIsDeletedFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

        @Override
        public TicketPageResponse getAllTickets(int page, int size, String search, String status, String category) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.max(size, 1);

        String normalizedSearch = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        String normalizedStatus = status == null ? "ALL" : status.trim().toUpperCase(Locale.ROOT);
        String normalizedCategory = category == null ? "ALL" : category.trim().toUpperCase(Locale.ROOT);

        List<TicketResponse> filtered = ticketRepository.findByIsDeletedFalseOrderByCreatedAtDesc()
            .stream()
            .filter(ticket -> {
                if (normalizedSearch.isBlank()) {
                return true;
                }

                String title = ticket.getTitle() == null ? "" : ticket.getTitle().toLowerCase(Locale.ROOT);
                String description = ticket.getDescription() == null ? "" : ticket.getDescription().toLowerCase(Locale.ROOT);
                String ticketStatus = ticket.getStatus() == null ? "" : ticket.getStatus().name().toLowerCase(Locale.ROOT);
                String ticketCategory = ticket.getCategory() == null ? "" : ticket.getCategory().name().toLowerCase(Locale.ROOT);

                return title.contains(normalizedSearch)
                    || description.contains(normalizedSearch)
                    || ticketStatus.contains(normalizedSearch)
                    || ticketCategory.contains(normalizedSearch);
            })
            .filter(ticket -> "ALL".equals(normalizedStatus)
                || (ticket.getStatus() != null && ticket.getStatus().name().equals(normalizedStatus)))
            .filter(ticket -> "ALL".equals(normalizedCategory)
                || (ticket.getCategory() != null && ticket.getCategory().name().equals(normalizedCategory)))
            .map(this::toResponse)
            .toList();

        int totalElements = filtered.size();
        int totalPages = totalElements == 0 ? 1 : (int) Math.ceil((double) totalElements / safeSize);
        int adjustedPage = Math.min(safePage, totalPages);

        int fromIndex = (adjustedPage - 1) * safeSize;
        int toIndex = Math.min(fromIndex + safeSize, totalElements);

        List<TicketResponse> content = fromIndex >= totalElements
            ? List.of()
            : filtered.subList(fromIndex, toIndex);

        return new TicketPageResponse(
            content,
            adjustedPage,
            safeSize,
            totalElements,
            totalPages,
            adjustedPage <= 1,
            adjustedPage >= totalPages
        );
        }

    @Override
    public List<TicketResponse> getAssignedTickets(String technicianId) {
        return ticketRepository.findByTechnicianIdAndIsDeletedFalseOrderByUpdatedAtDesc(technicianId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TicketResponse updateIncident(String ticketId, String requesterId, UpdateIncidentRequest request) {
        Ticket ticket = findTicketOrThrow(ticketId);
        validateOwnerAccess(ticket, requesterId);
        ensureOpenStatus(ticket);

        ticket.setTitle(request.getTitle().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setUpdatedAt(LocalDateTime.now());

        return toResponse(ticketRepository.save(ticket));
    }

    @Override
    public void deleteIncident(String ticketId, String requesterId) {
        Ticket ticket = findTicketOrThrow(ticketId);
        validateOwnerAccess(ticket, requesterId);
        ensureOpenStatus(ticket);

        ticket.setDeleted(true);
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
    }

    @Override
    public TicketResponse getTicketById(String ticketId, String requesterId, Role requesterRole) {
        Ticket ticket = findTicketOrThrow(ticketId);
        validateReadAccess(ticket, requesterId, requesterRole);
        return toResponse(ticket);
    }

    @Override
    public TicketResponse assignTechnician(String ticketId, AssignTechnicianRequest request, String adminId) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalArgumentException("Technician can only be assigned when ticket is OPEN");
        }

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getTechnicianId()));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new IllegalArgumentException("Assigned user must have TECHNICIAN role");
        }

        ticket.setTechnicianId(technician.getId());
        ticket.setStatus(TicketStatus.ASSIGNED);
        ticket.setUpdatedAt(LocalDateTime.now());
        addHistoryEntry(ticket, "ASSIGNED", "Assigned to technician", adminId);

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotification(new CreateNotificationRequest(
                technician.getId(),
                NotificationType.INFO,
            "You have been assigned incident ticket: " + saved.getTitle(),
            NotificationPreferenceCategory.ASSIGNMENTS
        ));

        return toResponse(saved);
    }

    @Override
    public TicketResponse updateTicketStatus(String ticketId,
                                             String requesterId,
                                             Role requesterRole,
                                             UpdateTicketStatusRequest request) {
        Ticket ticket = findTicketOrThrow(ticketId);

        TicketStatus currentStatus = ticket.getStatus();
        TicketStatus newStatus = request.getStatus();
        validateStatusTransitionAndRole(ticket, currentStatus, newStatus, requesterId, requesterRole);

        if (currentStatus == TicketStatus.ASSIGNED && newStatus == TicketStatus.IN_PROGRESS) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
            if (ticket.getFirstResponseAt() == null) {
                ticket.setFirstResponseAt(LocalDateTime.now());
            }
        } else if (currentStatus == TicketStatus.IN_PROGRESS && newStatus == TicketStatus.RESOLVED) {
            ticket.setStatus(TicketStatus.RESOLVED);
            ticket.setResolvedAt(LocalDateTime.now());
        } else if (currentStatus == TicketStatus.RESOLVED && newStatus == TicketStatus.CLOSED) {
            ticket.setStatus(TicketStatus.CLOSED);
        } else {
            throw new IllegalArgumentException(
                    "Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        if (newStatus == TicketStatus.CLOSED) {
            addHistoryEntry(ticket, "CLOSED", "Incident closed", requesterId);
        } else {
            addHistoryEntry(ticket, "STATUS_CHANGED", "Status changed to " + newStatus, requesterId);
        }
        Ticket saved = ticketRepository.save(ticket);

        if (newStatus == TicketStatus.RESOLVED) {
            notificationService.createNotification(new CreateNotificationRequest(
                    saved.getUserId(),
                    NotificationType.INFO,
                    "Incident ticket status updated to RESOLVED: " + saved.getTitle(),
                    NotificationPreferenceCategory.STATUS_UPDATES
            ));
        } else if (newStatus == TicketStatus.CLOSED) {
            notificationService.createNotification(new CreateNotificationRequest(
                    saved.getUserId(),
                    NotificationType.INFO,
                    "Incident ticket status updated to CLOSED: " + saved.getTitle(),
                    NotificationPreferenceCategory.STATUS_UPDATES
            ));
        }

        return toResponse(saved);
    }

    @Override
    public TicketUpdateLogResponse addUpdateMessage(String ticketId, String technicianId, String message) {
        Ticket ticket = findTicketOrThrow(ticketId);
        validateTechnicianOwnership(ticket, technicianId);

        TicketUpdateLog updateLog = new TicketUpdateLog();
        updateLog.setTicketId(ticketId);
        updateLog.setTechnicianId(technicianId);
        updateLog.setMessage(message.trim());
        updateLog.setCreatedAt(LocalDateTime.now());

        TicketUpdateLog savedLog = ticketUpdateLogRepository.save(updateLog);

        if (ticket.getFirstResponseAt() == null) {
            ticket.setFirstResponseAt(savedLog.getCreatedAt());
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        addHistoryEntry(ticket, "COMMENT_ADDED", message.trim(), technicianId);
        ticketRepository.save(ticket);

        notificationService.createNotification(new CreateNotificationRequest(
                ticket.getUserId(),
                NotificationType.INFO,
            "Technician update on your ticket: " + ticket.getTitle(),
            NotificationPreferenceCategory.TECHNICIAN_UPDATES
        ));

        return toUpdateResponse(savedLog);
    }

    @Override
    public TicketResponse uploadAttachment(String ticketId,
                                           String requesterId,
                                           Role requesterRole,
                                           MultipartFile file) {
        Ticket ticket = findTicketOrThrow(ticketId);
        validateAttachmentAccess(ticket, requesterId, requesterRole);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Attachment file is required");
        }

        if (file.getSize() > MAX_ATTACHMENT_SIZE_BYTES) {
            throw new IllegalArgumentException("File size must not exceed 5MB");
        }

        String originalName = file.getOriginalFilename() == null ? "attachment.bin" : file.getOriginalFilename();
        String safeOriginalName = Paths.get(originalName).getFileName().toString().replace(" ", "_");

        String storedName = UUID.randomUUID() + "_" + safeOriginalName;
        Path uploadDir = Paths.get("uploads");
        Path outputPath = uploadDir.resolve(storedName).toAbsolutePath();

        try {
            Files.createDirectories(uploadDir);
            file.transferTo(outputPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store attachment", e);
        }

        List<String> attachments = ticket.getAttachments() == null
                ? new ArrayList<>()
                : new ArrayList<>(ticket.getAttachments());

        attachments.add("/uploads/" + storedName);
        ticket.setAttachments(attachments);
        ticket.setUpdatedAt(LocalDateTime.now());

        return toResponse(ticketRepository.save(ticket));
    }

    @Override
    public AttachmentDownloadInfo getAttachmentForDownload(String ticketId,
                                                           String requesterId,
                                                           Role requesterRole,
                                                           String attachmentPath) {
        Ticket ticket = findTicketOrThrow(ticketId);
        validateReadAccess(ticket, requesterId, requesterRole);

        if (attachmentPath == null || attachmentPath.isBlank()) {
            throw new IllegalArgumentException("Attachment path is required");
        }

        List<String> attachments = ticket.getAttachments() == null ? List.of() : ticket.getAttachments();
        if (!attachments.contains(attachmentPath)) {
            throw new ResourceNotFoundException("Attachment", "path", attachmentPath);
        }

        String fileName = Paths.get(attachmentPath).getFileName().toString();
        Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        Path filePath = uploadDir.resolve(fileName).normalize();

        if (!filePath.startsWith(uploadDir)) {
            throw new ForbiddenOperationException("Invalid attachment path");
        }

        if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
            throw new ResourceNotFoundException("Attachment", "path", attachmentPath);
        }

        int underscoreIndex = fileName.indexOf('_');
        String downloadName = underscoreIndex > -1 ? fileName.substring(underscoreIndex + 1) : fileName;

        return new AttachmentDownloadInfo(filePath, downloadName);
    }

    @Override
    public List<TicketUpdateLogResponse> getTicketUpdates(String ticketId, String requesterId, Role requesterRole) {
        Ticket ticket = findTicketOrThrow(ticketId);
        validateReadAccess(ticket, requesterId, requesterRole);

        return ticketUpdateLogRepository.findByTicketIdOrderByCreatedAtDesc(ticketId)
                .stream()
                .map(this::toUpdateResponse)
                .toList();
    }

    private Ticket findTicketOrThrow(String ticketId) {
        return ticketRepository.findByIdAndIsDeletedFalse(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));
    }

    private void validateOwnerAccess(Ticket ticket, String requesterId) {
        if (!ticket.getUserId().equals(requesterId)) {
            throw new ForbiddenOperationException("You are not allowed to modify this incident");
        }
    }

    private void ensureOpenStatus(Ticket ticket) {
        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalArgumentException("Cannot modify incident after assignment");
        }
    }

    private void validateReadAccess(Ticket ticket, String requesterId, Role requesterRole) {
        if (requesterRole == Role.ADMIN) {
            return;
        }

        if (requesterRole == Role.USER && ticket.getUserId().equals(requesterId)) {
            return;
        }

        if (requesterRole == Role.TECHNICIAN && requesterId.equals(ticket.getTechnicianId())) {
            return;
        }

        throw new ForbiddenOperationException("You are not allowed to view this ticket");
    }

    private void validateAttachmentAccess(Ticket ticket, String requesterId, Role requesterRole) {
        if (requesterRole == Role.ADMIN) {
            return;
        }

        if (requesterRole == Role.USER && requesterId.equals(ticket.getUserId())) {
            return;
        }

        if (requesterRole == Role.TECHNICIAN && requesterId.equals(ticket.getTechnicianId())) {
            return;
        }

        throw new ForbiddenOperationException("You are not allowed to upload attachments to this ticket");
    }

    private void validateTechnicianOwnership(Ticket ticket, String technicianId) {
        if (ticket.getTechnicianId() == null || !ticket.getTechnicianId().equals(technicianId)) {
            throw new ForbiddenOperationException("Ticket is not assigned to this technician");
        }
    }

    private void validateStatusTransitionAndRole(Ticket ticket,
                                                 TicketStatus currentStatus,
                                                 TicketStatus newStatus,
                                                 String requesterId,
                                                 Role requesterRole) {
        if (currentStatus == TicketStatus.ASSIGNED && newStatus == TicketStatus.IN_PROGRESS) {
            if (requesterRole != Role.TECHNICIAN) {
                throw new ForbiddenOperationException("Only technicians can move a ticket to IN_PROGRESS");
            }
            validateTechnicianOwnership(ticket, requesterId);
            return;
        }

        if (currentStatus == TicketStatus.IN_PROGRESS && newStatus == TicketStatus.RESOLVED) {
            if (requesterRole != Role.TECHNICIAN) {
                throw new ForbiddenOperationException("Only technicians can resolve a ticket");
            }
            validateTechnicianOwnership(ticket, requesterId);
            return;
        }

        if (currentStatus == TicketStatus.RESOLVED && newStatus == TicketStatus.CLOSED) {
            if (requesterRole != Role.ADMIN) {
                throw new ForbiddenOperationException("Only admins can close a resolved ticket");
            }
            return;
        }

        throw new IllegalArgumentException("Invalid status transition from " + currentStatus + " to " + newStatus);
    }

    private TicketResponse toResponse(Ticket ticket) {
        String technicianName = null;
        if (ticket.getTechnicianId() != null && !ticket.getTechnicianId().isBlank()) {
            technicianName = userRepository.findById(ticket.getTechnicianId())
                .map(user -> user.getName() != null && !user.getName().isBlank()
                    ? user.getName()
                    : user.getEmail())
                .orElse(ticket.getTechnicianId());
        }

        List<TicketHistoryItemResponse> history = (ticket.getHistory() == null ? List.<TicketHistoryEntry>of() : ticket.getHistory())
            .stream()
            .filter(entry -> !isRedundantClosedStatusEntry(entry))
            .sorted(Comparator.comparing(TicketHistoryEntry::getCreatedAt,
                Comparator.nullsLast(Comparator.naturalOrder())).reversed())
            .map(this::toHistoryResponse)
            .toList();

        return new TicketResponse(
                ticket.getId(),
                ticket.getUserId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getTechnicianId(),
            technicianName,
                ticket.getAttachments(),
                ticket.getCreatedAt(),
                ticket.getFirstResponseAt(),
                ticket.getResolvedAt(),
                ticket.getUpdatedAt(),
                formatResolutionTime(ticket.getCreatedAt(), ticket.getResolvedAt()),
                ticket.getTimeToFirstResponseMinutes(),
                ticket.getTimeToResolutionMinutes(),
                history
        );
    }

    private String formatResolutionTime(LocalDateTime createdAt, LocalDateTime resolvedAt) {
        if (createdAt == null || resolvedAt == null) {
            return null;
        }

        Duration duration = Duration.between(createdAt, resolvedAt);
        if (duration.isNegative()) {
            return null;
        }

        long totalMinutes = duration.toMinutes();
        long hours = totalMinutes / 60;
        long minutes = totalMinutes % 60;
        return hours + "h " + minutes + "m";
    }

    private TicketHistoryItemResponse toHistoryResponse(TicketHistoryEntry entry) {
        String performerId = entry.getPerformedBy();
        String performerName = "System";
        String performerRole = "SYSTEM";

        if (performerId != null && !performerId.isBlank()) {
            User performer = userRepository.findById(performerId).orElse(null);
            if (performer == null) {
                performerName = performerId;
                performerRole = "UNKNOWN";
            } else {
                performerName = performer.getName() != null && !performer.getName().isBlank()
                        ? performer.getName()
                        : performer.getEmail();
                performerRole = performer.getRole() == null ? "UNKNOWN" : performer.getRole().name();
            }
        }

        return new TicketHistoryItemResponse(
                entry.getAction(),
                entry.getMessage(),
                entry.getPerformedBy(),
                performerName,
                performerRole,
                entry.getCreatedAt()
        );
    }

    private void addHistoryEntry(Ticket ticket, String action, String message, String performedBy) {
        List<TicketHistoryEntry> history = ticket.getHistory() == null
                ? new ArrayList<>()
                : new ArrayList<>(ticket.getHistory());

        history.add(new TicketHistoryEntry(action, message, performedBy, LocalDateTime.now()));
        ticket.setHistory(history);
    }

    private boolean isRedundantClosedStatusEntry(TicketHistoryEntry entry) {
        if (entry == null || entry.getAction() == null) {
            return false;
        }

        if (!"STATUS_CHANGED".equalsIgnoreCase(entry.getAction())) {
            return false;
        }

        String message = entry.getMessage();
        return message != null && message.toUpperCase(Locale.ROOT).contains("CLOSED");
    }

    private TicketUpdateLogResponse toUpdateResponse(TicketUpdateLog updateLog) {
        String technicianName = userRepository.findById(updateLog.getTechnicianId())
            .map(user -> user.getName() != null && !user.getName().isBlank()
                ? user.getName()
                : user.getEmail())
            .orElse(updateLog.getTechnicianId());

        return new TicketUpdateLogResponse(
                updateLog.getId(),
                updateLog.getTicketId(),
                updateLog.getTechnicianId(),
            technicianName,
                updateLog.getMessage(),
                updateLog.getCreatedAt()
        );
    }
}
