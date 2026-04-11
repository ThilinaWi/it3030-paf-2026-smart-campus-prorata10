package com.smartcampus.booking.controller;

import com.smartcampus.auth.model.User;
import com.smartcampus.booking.dto.BookingDTO;
import com.smartcampus.booking.dto.CreateBookingRequest;
import com.smartcampus.booking.dto.UpdateBookingRequest;
import com.smartcampus.booking.dto.UpdateBookingStatusRequest;
import com.smartcampus.booking.entity.BookingStatus;
import com.smartcampus.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for booking management endpoints..
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new booking (default status = PENDING)..
     * POST /api/bookings
     */
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal User user) {
        BookingDTO booking = bookingService.createBooking(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    
    /**
     * Update an existing booking (USER only, must own booking).
     * PUT /api/bookings/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable String id,
            @Valid @RequestBody UpdateBookingRequest request,
            @AuthenticationPrincipal User user) {
        BookingDTO booking = bookingService.updateBooking(id, user.getId(), request);
        return ResponseEntity.ok(booking);
    }
     
    /**
     * Get all bookings for the logged-in user.
     * GET /api/bookings/my
     */
    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO>> getMyBookings(
            @AuthenticationPrincipal User user) {
        List<BookingDTO> bookings = bookingService.getUserBookings(user.getId());
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get all bookings (ADMIN only).
     * GET /api/bookings
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingDTO>> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        List<BookingDTO> bookings = status == null
                ? bookingService.getAllBookings()
                : bookingService.getAllBookings(status);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Approve or reject a booking (ADMIN only).
     * PATCH /api/bookings/{id}/status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        BookingDTO booking = bookingService.updateBookingStatus(id, request.getStatus(), request.getReason());
        return ResponseEntity.ok(booking);
    }

    /**
     * Cancel a booking (USER only, must own the booking).
     * DELETE /api/bookings/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<BookingDTO> cancelBooking(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        BookingDTO booking = bookingService.cancelBooking(id, user.getId());
        return ResponseEntity.ok(booking);
    }
}
