package com.smartcampus.service;

import com.smartcampus.dto.ResourceCreateDTO;
import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.dto.ResourceUpdateDTO;
import java.util.List;

public interface ResourceService {
    ResourceDTO createResource(ResourceCreateDTO dto);
    ResourceDTO updateResource(String id, ResourceUpdateDTO dto);
    void deleteResource(String id);
    ResourceDTO getResourceById(String id);
    List<ResourceDTO> getAllResources();
    List<ResourceDTO> searchResources(String type, Integer minCapacity, String location, String searchTerm);
}