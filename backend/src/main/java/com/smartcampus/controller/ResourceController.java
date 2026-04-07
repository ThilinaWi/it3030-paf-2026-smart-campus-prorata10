package com.smartcampus.controller;

import com.smartcampus.dto.ResourceCreateDTO;
import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.dto.ResourceUpdateDTO;
import com.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;
    
    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }
    
    @PostMapping
    public ResponseEntity<ResourceDTO> createResource(@Valid @RequestBody ResourceCreateDTO dto) {
        ResourceDTO created = resourceService.createResource(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ResourceDTO> updateResource(@PathVariable String id, @Valid @RequestBody ResourceUpdateDTO dto) {
        return ResponseEntity.ok(resourceService.updateResource(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ResourceDTO>> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String searchTerm) {
        return ResponseEntity.ok(resourceService.searchResources(type, minCapacity, location, searchTerm));
    }
}