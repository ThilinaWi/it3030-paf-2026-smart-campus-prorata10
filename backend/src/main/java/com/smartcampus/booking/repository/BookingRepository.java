package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * MongoDB repository for Booking documents.
 */
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, LocalDate date, List<BookingStatus> statuses);

    List<Booking> findAllByOrderByCreatedAtDesc();
}
