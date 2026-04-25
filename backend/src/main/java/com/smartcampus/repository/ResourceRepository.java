package com.smartcampus.repository;

import com.smartcampus.model.Resource;
import com.smartcampus.model.enums.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    boolean existsByName(String name);
    List<Resource> findByNameContainingIgnoreCase(String name);
    List<Resource> findByType(ResourceType type);
}