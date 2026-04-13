package com.smartcampus.booking.service;

import com.smartcampus.auth.model.Role;
import com.smartcampus.auth.repository.UserRepository;
import com.smartcampus.booking.dto.BookingDTO;
import com.smartcampus.booking.dto.CreateBookingRequest;
import com.smartcampus.booking.dto.UpdateBookingRequest;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;
import com.smartcampus.booking.repository.BookingRepository;
import com.smartcampus.exception.ConflictException;
import com.smartcampus.exception.ForbiddenOperationException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.notification.dto.CreateNotificationRequest;
import com.smartcampus.notification.model.NotificationType;
import com.smartcampus.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;


/**
 * Service handling booking business logic including conflict detection,
 * status workflow management, and notification integration.
 */
@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);
    private static final DateTimeFormatter CLOCK_12H_FORMAT = DateTimeFormatter.ofPattern("h:mm a");

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          NotificationService notificationService,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    /**
     * Create a new booking after validating time constraints and checking for conflicts.
     */
    public BookingDTO createBooking(String userId, CreateBookingRequest request) {
        // Validate that startTime is before endTime
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Check for scheduling conflicts
        checkForConflicts(
                request.getResourceId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                null
        );

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setResourceId(request.getResourceId());
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setAttendees(request.getAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        sendNewBookingNotificationToAdmins(saved);
        log.info("Booking created by user {} for resource {} on {}",
                userId, request.getResourceId(), request.getDate());
        return toDTO(saved);
    }

    /**
     * Update an existing booking for the owner when booking is still editable.
     */
    public BookingDTO updateBooking(String bookingId, String userId, UpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new ForbiddenOperationException("You can only update your own bookings");
        }

        if (booking.getStatus() == BookingStatus.REJECTED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Only PENDING or APPROVED bookings can be updated");
        }

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        checkForConflicts(
                request.getResourceId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                bookingId
        );

        booking.setResourceId(request.getResourceId());
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setAttendees(request.getAttendees());

        // Any edit to an already approved booking must go through admin approval again.
        boolean wasApproved = booking.getStatus() == BookingStatus.APPROVED;
        if (wasApproved) {
            booking.setStatus(BookingStatus.PENDING);
        }

        Booking updated = bookingRepository.save(booking);
        if (wasApproved) {
            sendUpdatedBookingNotificationToAdmins(updated);
        }
        log.info("Booking {} updated by user {}", bookingId, userId);
        return toDTO(updated);
    }

    /**
     * Get all bookings for a specific user, ordered by creation date descending.
     */
    public List<BookingDTO> getUserBookings(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all bookings (admin only), ordered by creation date descending.
     */
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all bookings for a given status (admin filter support).
     */
    public List<BookingDTO> getAllBookings(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update booking status (approve or reject). Only PENDING bookings can be approved/rejected.
     * Triggers a notification to the booking owner.
     */
    public BookingDTO updateBookingStatus(String bookingId, BookingStatus newStatus, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Validate status transition
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only PENDING bookings can be approved or rejected. Current status: " + booking.getStatus());
        }

        if (newStatus != BookingStatus.APPROVED && newStatus != BookingStatus.REJECTED) {
            throw new IllegalArgumentException(
                    "Booking can only be APPROVED or REJECTED by admin. Received: " + newStatus);
        }

        String trimmedReason = reason == null ? null : reason.trim();
        if (newStatus == BookingStatus.REJECTED && (trimmedReason == null || trimmedReason.isEmpty())) {
            throw new IllegalArgumentException("Reason is required when rejecting a booking");
        }

        booking.setStatus(newStatus);
        booking.setAdminReason(newStatus == BookingStatus.REJECTED ? trimmedReason : null);
        Booking updated = bookingRepository.save(booking);
        log.info("Booking {} status updated to {} by admin", bookingId, newStatus);

        // Trigger notification to the booking owner
        sendStatusNotification(updated.getUserId(), updated.getStatus(), updated.getResourceId(), updated.getAdminReason());

        return toDTO(updated);
    }

    /**
     * Cancel a booking. Only the booking owner can cancel, and only if the booking is not already cancelled.
     */
    public BookingDTO cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Ensure the user owns this booking
        if (!booking.getUserId().equals(userId)) {
            throw new ForbiddenOperationException("You can only cancel your own bookings");
        }

        // Validate that booking can be cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot cancel a rejected booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        log.info("Booking {} cancelled by user {}", bookingId, userId);
        return toDTO(updated);
    }

    /**
     * Check for scheduling conflicts for the same resource on the same date.
     * A conflict exists if: newStart < existingEnd AND newEnd > existingStart
     */
    private void checkForConflicts(
            String resourceId,
            java.time.LocalDate date,
            java.time.LocalTime startTime,
            java.time.LocalTime endTime,
            String excludedBookingId
    ) {
        List<BookingStatus> activeStatuses = List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

        List<Booking> existingBookings = bookingRepository
                .findByResourceIdAndDateAndStatusIn(resourceId, date, activeStatuses);

        for (Booking existing : existingBookings) {
            if (excludedBookingId != null && excludedBookingId.equals(existing.getId())) {
                continue;
            }

            boolean hasConflict = startTime.isBefore(existing.getEndTime())
                    && endTime.isAfter(existing.getStartTime());

            if (hasConflict) {
                String details = String.format(
                        "Time slot %s-%s overlaps with existing booking %s-%s",
                        startTime, endTime,
                        existing.getStartTime(), existing.getEndTime());
                throw new ConflictException("Booking", details);
            }
        }
    }

    /**
     * Send a notification to the user when their booking status changes.
     */
    private void sendStatusNotification(String userId, BookingStatus status, String resourceId, String reason) {
        String message;
        if (status == BookingStatus.APPROVED) {
            message = String.format("Approved: Your booking for %s has been approved", resourceId);
        } else {
            message = String.format("Rejected: Your booking for %s was rejected (reason: %s)", resourceId, reason);
        }

        CreateNotificationRequest notificationRequest = new CreateNotificationRequest(
                userId, NotificationType.INFO, message);
        notificationService.createNotification(notificationRequest);
        log.info("Notification sent to user {} for booking status: {}", userId, status);
    }

    private void sendNewBookingNotificationToAdmins(Booking booking) {
        String requesterName = resolveUserName(booking.getUserId());
        String timeRange = formatTimeRange(booking.getStartTime(), booking.getEndTime());
        String message = String.format(
            "New booking request from %s for %s on %s (%s)",
            requesterName,
                booking.getResourceId(),
                booking.getDate(),
                timeRange
        );
        notificationService.createNotificationsForRole(Role.ADMIN, NotificationType.ALERT, message);
    }

    private void sendUpdatedBookingNotificationToAdmins(Booking booking) {
        String requesterName = resolveUserName(booking.getUserId());
        String timeRange = formatTimeRange(booking.getStartTime(), booking.getEndTime());
        String message = String.format(
            "Booking update from %s requires re-approval for %s on %s (%s)",
            requesterName,
                booking.getResourceId(),
                booking.getDate(),
                timeRange
        );
        notificationService.createNotificationsForRole(Role.ADMIN, NotificationType.ALERT, message);
    }

    /**
     * Convert Booking entity to BookingDTO.
     */
    private BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO(
                booking.getId(),
                booking.getUserId(),
                booking.getResourceId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getAttendees(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
        dto.setAdminReason(booking.getAdminReason());
        dto.setUserName(resolveUserName(booking.getUserId()));
        return dto;
    }

    private String resolveUserName(String userId) {
        return userRepository.findById(userId)
                .map(user -> user.getName() == null || user.getName().isBlank() ? user.getEmail() : user.getName())
                .orElse(userId);
    }

    private String formatTimeRange(LocalTime startTime, LocalTime endTime) {
        return formatClockTime(startTime) + "-" + formatClockTime(endTime);
    }

    private String formatClockTime(LocalTime time) {
        return time.format(CLOCK_12H_FORMAT);
    }
}
