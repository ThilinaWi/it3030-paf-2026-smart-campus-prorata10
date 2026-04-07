package com.smartcampus.booking.service;

import com.smartcampus.exception.ConflictException;
import com.smartcampus.exception.ForbiddenOperationException;
import com.smartcampus.model.dto.request.CreateBookingRequest;
import com.smartcampus.model.dto.request.UpdateBookingRequest;
import com.smartcampus.model.dto.response.BookingDTO;
import com.smartcampus.model.entity.Booking;
import com.smartcampus.model.enums.BookingStatus;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.model.enums.Role;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.BookingService;
import com.smartcampus.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private NotificationService notificationService;

        @Mock
        private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private CreateBookingRequest request;

    @BeforeEach
    void setUp() {
                lenient().when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        request = new CreateBookingRequest(
                "room-101",
                LocalDate.now().plusDays(1),
                LocalTime.of(10, 0),
                LocalTime.of(11, 0),
                "Project meeting",
                List.of("alice@campus.edu")
        );
    }

    @Test
    void createBooking_shouldThrowConflict_whenTimeOverlaps() {
        Booking existing = new Booking(
                "b1",
                "user-2",
                "room-101",
                request.getDate(),
                LocalTime.of(10, 30),
                LocalTime.of(11, 30),
                "Existing",
                List.of("bob@campus.edu"),
                BookingStatus.APPROVED,
                LocalDateTime.now()
        );

        when(bookingRepository.findByResourceIdAndDateAndStatusIn(
                request.getResourceId(), request.getDate(), List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        )).thenReturn(List.of(existing));

        assertThrows(ConflictException.class, () -> bookingService.createBooking("user-1", request));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void createBooking_shouldAllowBoundaryBooking_whenEndEqualsExistingStart() {
        Booking existing = new Booking(
                "b1",
                "user-2",
                "room-101",
                request.getDate(),
                LocalTime.of(11, 0),
                LocalTime.of(12, 0),
                "Existing",
                List.of("bob@campus.edu"),
                BookingStatus.PENDING,
                LocalDateTime.now()
        );

        when(bookingRepository.findByResourceIdAndDateAndStatusIn(
                request.getResourceId(), request.getDate(), List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        )).thenReturn(List.of(existing));

        Booking saved = new Booking(
                "new-id",
                "user-1",
                request.getResourceId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getPurpose(),
                request.getAttendees(),
                BookingStatus.PENDING,
                LocalDateTime.now()
        );
        when(bookingRepository.save(any(Booking.class))).thenReturn(saved);

        BookingDTO result = bookingService.createBooking("user-1", request);
        assertEquals("new-id", result.getId());

        ArgumentCaptor<Booking> bookingCaptor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(bookingCaptor.capture());
        assertEquals("user-1", bookingCaptor.getValue().getUserId());
        assertEquals(BookingStatus.PENDING, bookingCaptor.getValue().getStatus());
        verify(notificationService).createNotificationsForRole(
                eq(Role.ADMIN),
                eq(NotificationType.ALERT),
                contains("New booking request")
        );
    }

    @Test
    void cancelBooking_shouldThrowForbidden_whenUserIsNotOwner() {
        Booking booking = new Booking();
        booking.setId("b1");
        booking.setUserId("owner-1");
        booking.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));

        ForbiddenOperationException ex = assertThrows(
                ForbiddenOperationException.class,
                () -> bookingService.cancelBooking("b1", "other-user")
        );

        assertTrue(ex.getMessage().contains("own bookings"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void cancelBooking_shouldCancel_whenOwnerAndValidStatus() {
        Booking booking = new Booking();
        booking.setId("b1");
        booking.setUserId("owner-1");
        booking.setStatus(BookingStatus.APPROVED);

        when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingDTO result = bookingService.cancelBooking("b1", "owner-1");

        assertEquals(BookingStatus.CANCELLED, result.getStatus());
        verify(bookingRepository).save(any(Booking.class));
    }

        @Test
        void updateBooking_shouldThrowForbidden_whenUserIsNotOwner() {
                Booking existing = new Booking();
                existing.setId("b1");
                existing.setUserId("owner-1");
                existing.setStatus(BookingStatus.PENDING);

                UpdateBookingRequest updateRequest = new UpdateBookingRequest();
                updateRequest.setResourceId("room-102");
                updateRequest.setDate(LocalDate.now().plusDays(2));
                updateRequest.setStartTime(LocalTime.of(9, 0));
                updateRequest.setEndTime(LocalTime.of(10, 0));
                updateRequest.setPurpose("Updated");
                updateRequest.setAttendees(List.of("alice@campus.edu"));

                when(bookingRepository.findById("b1")).thenReturn(Optional.of(existing));

                assertThrows(ForbiddenOperationException.class,
                                () -> bookingService.updateBooking("b1", "other-user", updateRequest));
        }

        @Test
        void updateBooking_shouldThrowConflict_whenUpdatedTimeOverlapsAnotherBooking() {
                Booking current = new Booking();
                current.setId("b1");
                current.setUserId("owner-1");
                current.setStatus(BookingStatus.PENDING);

                Booking conflicting = new Booking();
                conflicting.setId("b2");
                conflicting.setResourceId("room-101");
                conflicting.setDate(LocalDate.now().plusDays(1));
                conflicting.setStartTime(LocalTime.of(10, 30));
                conflicting.setEndTime(LocalTime.of(11, 30));
                conflicting.setStatus(BookingStatus.APPROVED);

                UpdateBookingRequest updateRequest = new UpdateBookingRequest();
                updateRequest.setResourceId("room-101");
                updateRequest.setDate(LocalDate.now().plusDays(1));
                updateRequest.setStartTime(LocalTime.of(10, 0));
                updateRequest.setEndTime(LocalTime.of(11, 0));
                updateRequest.setPurpose("Updated");
                updateRequest.setAttendees(List.of("alice@campus.edu"));

                when(bookingRepository.findById("b1")).thenReturn(Optional.of(current));
                when(bookingRepository.findByResourceIdAndDateAndStatusIn(
                                updateRequest.getResourceId(),
                                updateRequest.getDate(),
                                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
                )).thenReturn(List.of(current, conflicting));

                assertThrows(ConflictException.class,
                                () -> bookingService.updateBooking("b1", "owner-1", updateRequest));
        }

        @Test
        void updateBooking_shouldSucceed_whenOwnerAndNoConflicts() {
                Booking current = new Booking();
                current.setId("b1");
                current.setUserId("owner-1");
                current.setStatus(BookingStatus.PENDING);
                current.setResourceId("room-101");
                current.setDate(LocalDate.now().plusDays(1));
                current.setStartTime(LocalTime.of(8, 0));
                current.setEndTime(LocalTime.of(9, 0));

                UpdateBookingRequest updateRequest = new UpdateBookingRequest();
                updateRequest.setResourceId("room-102");
                updateRequest.setDate(LocalDate.now().plusDays(2));
                updateRequest.setStartTime(LocalTime.of(9, 0));
                updateRequest.setEndTime(LocalTime.of(10, 0));
                updateRequest.setPurpose("Updated purpose");
                updateRequest.setAttendees(List.of("alice@campus.edu", "bob@campus.edu"));

                when(bookingRepository.findById("b1")).thenReturn(Optional.of(current));
                when(bookingRepository.findByResourceIdAndDateAndStatusIn(
                                updateRequest.getResourceId(),
                                updateRequest.getDate(),
                                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
                )).thenReturn(List.of());
                when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

                BookingDTO result = bookingService.updateBooking("b1", "owner-1", updateRequest);

                assertEquals("room-102", result.getResourceId());
                assertEquals(LocalTime.of(9, 0), result.getStartTime());
                assertEquals(LocalTime.of(10, 0), result.getEndTime());
                assertEquals("Updated purpose", result.getPurpose());
        }

        @Test
        void updateBooking_shouldResetApprovedStatusToPending_whenEditedByOwner() {
                Booking current = new Booking();
                current.setId("b1");
                current.setUserId("owner-1");
                current.setStatus(BookingStatus.APPROVED);
                current.setResourceId("room-101");
                current.setDate(LocalDate.now().plusDays(1));
                current.setStartTime(LocalTime.of(8, 0));
                current.setEndTime(LocalTime.of(9, 0));

                UpdateBookingRequest updateRequest = new UpdateBookingRequest();
                updateRequest.setResourceId("room-101");
                updateRequest.setDate(LocalDate.now().plusDays(2));
                updateRequest.setStartTime(LocalTime.of(9, 0));
                updateRequest.setEndTime(LocalTime.of(10, 0));
                updateRequest.setPurpose("Approved booking edited");
                updateRequest.setAttendees(List.of("alice@campus.edu"));

                when(bookingRepository.findById("b1")).thenReturn(Optional.of(current));
                when(bookingRepository.findByResourceIdAndDateAndStatusIn(
                                updateRequest.getResourceId(),
                                updateRequest.getDate(),
                                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
                )).thenReturn(List.of());
                when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

                BookingDTO result = bookingService.updateBooking("b1", "owner-1", updateRequest);

                assertEquals(BookingStatus.PENDING, result.getStatus());
                verify(notificationService).createNotificationsForRole(
                                eq(Role.ADMIN),
                                eq(NotificationType.ALERT),
                                contains("requires re-approval")
                );
        }
}
