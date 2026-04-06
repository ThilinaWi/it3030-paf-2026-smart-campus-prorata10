package com.smartcampus.repository;

import com.smartcampus.model.entity.Booking;
import com.smartcampus.model.enums.BookingStatus;
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

    List<Booking> findByResourceIdAndDateAndStatusIn(
            String resourceId,
            LocalDate date,
            List<BookingStatus> statuses
    );

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    List<Booking> findAllByOrderByCreatedAtDesc();
}
