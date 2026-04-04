package com.smartcampus.auth.controller;

import com.smartcampus.auth.dto.AuthResponse;
import com.smartcampus.auth.dto.GoogleTokenRequest;
import com.smartcampus.auth.dto.UserDTO;
import com.smartcampus.auth.model.User;
import com.smartcampus.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
}
