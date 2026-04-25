package com.smartcampus.repository;

import com.smartcampus.model.entity.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    //  Get all tickets created by a specific user (excluding deleted ones)
    // Sorted by latest created tickets first
    @Query(value = "{ 'userId': ?0, 'isDeleted': { $ne: true } }", sort = "{ 'createdAt': -1 }")
    List<Ticket> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(String userId);

    //  Get all tickets assigned to a technician (excluding deleted ones)
    // Sorted by last updated time
    @Query(value = "{ 'technicianId': ?0, 'isDeleted': { $ne: true } }", sort = "{ 'updatedAt': -1 }")
    List<Ticket> findByTechnicianIdAndIsDeletedFalseOrderByUpdatedAtDesc(String technicianId);

    //  Get all active (not deleted) tickets
    // Sorted by latest created tickets first
    @Query(value = "{ 'isDeleted': { $ne: true } }", sort = "{ 'createdAt': -1 }")
    List<Ticket> findByIsDeletedFalseOrderByCreatedAtDesc();

    // Find a ticket by ID only if it is not deleted
    @Query("{ '_id': ?0, 'isDeleted': { $ne: true } }")
    java.util.Optional<Ticket> findByIdAndIsDeletedFalse(String id);
}