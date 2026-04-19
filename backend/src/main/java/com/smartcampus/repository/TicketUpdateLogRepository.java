package com.smartcampus.repository;

import com.smartcampus.model.entity.TicketUpdateLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketUpdateLogRepository extends MongoRepository<TicketUpdateLog, String> {
    List<TicketUpdateLog> findByTicketIdOrderByCreatedAtDesc(String ticketId);
}
