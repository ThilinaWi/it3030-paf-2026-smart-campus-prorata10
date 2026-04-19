package com.smartcampus.repository;

import com.smartcampus.model.entity.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
	@Query(value = "{ 'userId': ?0, 'isDeleted': { $ne: true } }", sort = "{ 'createdAt': -1 }")
	List<Ticket> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(String userId);

	@Query(value = "{ 'technicianId': ?0, 'isDeleted': { $ne: true } }", sort = "{ 'updatedAt': -1 }")
	List<Ticket> findByTechnicianIdAndIsDeletedFalseOrderByUpdatedAtDesc(String technicianId);

	@Query(value = "{ 'isDeleted': { $ne: true } }", sort = "{ 'createdAt': -1 }")
	List<Ticket> findByIsDeletedFalseOrderByCreatedAtDesc();

	@Query("{ '_id': ?0, 'isDeleted': { $ne: true } }")
	java.util.Optional<Ticket> findByIdAndIsDeletedFalse(String id);
}