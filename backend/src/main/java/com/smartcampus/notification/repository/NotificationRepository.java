package com.smartcampus.notification.repository;

import com.smartcampus.notification.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MongoDB repository for Notification documents.
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(String userId);

    long countByUserIdAndIsReadFalse(String userId);
}
