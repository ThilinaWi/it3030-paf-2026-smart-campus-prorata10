package com.smartcampus.service;

import com.smartcampus.dto.ResourceCreateDTO;
import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.dto.ResourceUpdateDTO;
import com.smartcampus.model.enums.ResourceType;
import java.util.List;

public interface ResourceService {
    ResourceDTO createResource(ResourceCreateDTO dto);
    ResourceDTO updateResource(String id, ResourceUpdateDTO dto);
    ResourceDTO updateResourceStatus(String id, boolean isActive);
    void deleteResource(String id);
    ResourceDTO getResourceById(String id);
    List<ResourceDTO> getResources(String name, ResourceType type, Integer minCapacity, String location);
}