package com.smartcampus.service.impl;

import com.smartcampus.dto.ResourceCreateDTO;
import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.dto.ResourceUpdateDTO;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Resource;
import com.smartcampus.model.enums.ResourceType;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ResourceServiceImpl implements ResourceService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Override
    public ResourceDTO createResource(ResourceCreateDTO dto) {
        Resource resource = new Resource(
            dto.getName(),
            dto.getType(),
            dto.getCapacity(),
            dto.getLocation()
        );
        resource.setDescription(dto.getDescription());
        resource.setImageUrl(dto.getImageUrl());
        resource.setAvailabilityWindow(dto.getAvailabilityWindow());
        
        Resource saved = resourceRepository.save(resource);
        return convertToDTO(saved);
    }
    
    @Override
    public ResourceDTO updateResource(String id, ResourceUpdateDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        
        if (dto.getName() != null) resource.setName(dto.getName());
        if (dto.getType() != null) resource.setType(dto.getType());
        if (dto.getCapacity() != null) resource.setCapacity(dto.getCapacity());
        if (dto.getLocation() != null) resource.setLocation(dto.getLocation());
        if (dto.getStatus() != null) {
            resource.setStatus(dto.getStatus());
            resource.setActive("ACTIVE".equalsIgnoreCase(dto.getStatus()));
        }
        if (dto.getDescription() != null) resource.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) resource.setImageUrl(dto.getImageUrl());
        if (dto.getAvailabilityWindow() != null) resource.setAvailabilityWindow(dto.getAvailabilityWindow());
        
        resource.setUpdatedAt(LocalDateTime.now());
        
        Resource updated = resourceRepository.save(resource);
        return convertToDTO(updated);
    }

    @Override
    public ResourceDTO updateResourceStatus(String id, boolean isActive) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setActive(isActive);
        resource.setStatus(isActive ? "ACTIVE" : "INACTIVE");
        resource.setUpdatedAt(LocalDateTime.now());

        Resource updated = resourceRepository.save(resource);
        return convertToDTO(updated);
    }
    
    @Override
    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
    
    @Override
    public ResourceDTO getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        if (!isAdmin() && !resource.isActive()) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }

        return convertToDTO(resource);
    }
    
    @Override
    public List<ResourceDTO> getResources(String name, ResourceType type, Integer minCapacity, String location) {
        List<Resource> resources = resourceRepository.findAll();
        List<ResourceDTO> dtos = new ArrayList<>();
        String normalizedName = name != null ? name.trim().toLowerCase(Locale.ROOT) : null;
        String normalizedLocation = location != null ? location.trim().toLowerCase(Locale.ROOT) : null;
        boolean admin = isAdmin();
        
        for (Resource resource : resources) {
            boolean matchesActive = admin || resource.isActive();
            boolean matchesName = normalizedName == null || normalizedName.isEmpty()
                    || (resource.getName() != null && resource.getName().toLowerCase(Locale.ROOT).contains(normalizedName));
            boolean matchesType = type == null || (resource.getType() != null && resource.getType() == type);
            boolean matchesCapacity = minCapacity == null || (resource.getCapacity() != null && resource.getCapacity() >= minCapacity);
            boolean matchesLocation = normalizedLocation == null || normalizedLocation.isEmpty()
                    || (resource.getLocation() != null && resource.getLocation().toLowerCase(Locale.ROOT).contains(normalizedLocation));

            if (matchesActive && matchesName && matchesType && matchesCapacity && matchesLocation) {
                dtos.add(convertToDTO(resource));
            }
        }
        return dtos;
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> "ROLE_ADMIN".equals(grantedAuthority.getAuthority()));
    }
    
    private ResourceDTO convertToDTO(Resource resource) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType() != null ? resource.getType().name() : null);
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setStatus(resource.getStatus());
        dto.setIsActive(resource.isActive());
        dto.setDescription(resource.getDescription());
        dto.setImageUrl(resource.getImageUrl());
        dto.setAvailabilityWindow(resource.getAvailabilityWindow());
        dto.setCreatedAt(resource.getCreatedAt());
        dto.setUpdatedAt(resource.getUpdatedAt());
        return dto;
    }
}