package com.smartcampus.controller;

import com.smartcampus.model.dto.response.AuthResponse;
import com.smartcampus.model.dto.request.GoogleTokenRequest;
import com.smartcampus.model.dto.request.UpdateProfileRequest;
import com.smartcampus.model.dto.response.UserDTO;
import com.smartcampus.model.entity.User;
import com.smartcampus.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller for authentication endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Exchange a Google ID token for a JWT token.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody GoogleTokenRequest request) {
        AuthResponse response = authService.authenticateWithGoogle(request.getToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Get the current authenticated user's profile.
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        UserDTO userDTO = authService.getCurrentUser(user.getId());
        return ResponseEntity.ok(userDTO);
    }

    /**
     * Update the current authenticated user's profile details.
     * PUT /api/auth/me
     */
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDTO userDTO = authService.updateCurrentUserProfile(user.getId(), request);
        return ResponseEntity.ok(userDTO);
    }

    /**
     * Upload and set current authenticated user's profile picture.
     * POST /api/auth/me/profile-picture
     */
    @PostMapping(value = "/me/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadProfilePicture(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        UserDTO userDTO = authService.uploadCurrentUserProfilePicture(user.getId(), file);
        return ResponseEntity.ok(userDTO);
    }
}
