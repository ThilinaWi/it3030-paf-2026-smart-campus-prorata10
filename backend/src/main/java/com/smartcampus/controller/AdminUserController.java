package com.smartcampus.controller;

import com.smartcampus.model.dto.request.UpdateUserRoleRequest;
import com.smartcampus.model.dto.response.UserDTO;
import com.smartcampus.model.entity.User;
import com.smartcampus.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Admin APIs for user role management.
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AuthService authService;

    public AdminUserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRoleRequest request,
            @AuthenticationPrincipal User adminUser) {
        UserDTO updated = authService.updateUserRole(id, request.getRole(), adminUser.getId());
        return ResponseEntity.ok(updated);
    }
}
