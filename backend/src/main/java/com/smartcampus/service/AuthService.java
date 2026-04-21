package com.smartcampus.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.smartcampus.security.JwtTokenProvider;
import com.smartcampus.model.dto.response.AuthResponse;
import com.smartcampus.model.dto.request.UpdateProfileRequest;
import com.smartcampus.model.dto.response.UserDTO;
import com.smartcampus.model.enums.Role;
import com.smartcampus.model.entity.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Comparator;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service handling authentication logic including Google OAuth token verification,
 * user creation/retrieval, and JWT token generation.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final long MAX_PROFILE_PICTURE_SIZE_BYTES = 5L * 1024 * 1024;

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleIdTokenVerifier verifier;
    private final String serverBaseUrl;

    public AuthService(UserRepository userRepository,
                       JwtTokenProvider jwtTokenProvider,
                       @Value("${app.google.client-id}") String googleClientId,
                       @Value("${app.server-base-url:http://localhost:8080}") String serverBaseUrl) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.serverBaseUrl = serverBaseUrl;
        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
    }

    /**
     * Authenticate a user with a Google ID token.
     */
    public AuthResponse authenticateWithGoogle(String googleToken) {
        try {
            GoogleIdToken idToken = verifier.verify(googleToken);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            // Find existing user or create new one
            User user = userRepository.findByEmail(email)
                    .map(existingUser -> {
                        existingUser.setName(name);
                        existingUser.setProfilePicture(pictureUrl);
                        return userRepository.save(existingUser);
                    })
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setName(name);
                        newUser.setEmail(email);
                        newUser.setProfilePicture(pictureUrl);
                        newUser.setRole(Role.USER);
                        newUser.setProvider("GOOGLE");
                        log.info("Creating new user: {}", email);
                        return userRepository.save(newUser);
                    });

            String jwtToken = jwtTokenProvider.generateToken(user);
            return AuthResponse.of(jwtToken, toDTO(user));

        } catch (GeneralSecurityException | IOException e) {
            log.error("Error verifying Google token", e);
            throw new RuntimeException("Failed to verify Google token: " + e.getMessage());
        }
    }

    /**
     * Get the current authenticated user's profile.
     */
    public UserDTO getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return toDTO(user);
    }

    /**
     * Update the current authenticated user's profile fields.
     */
    public UserDTO updateCurrentUserProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String trimmedName = request.getName() == null ? "" : request.getName().trim();
        if (trimmedName.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }

        String profilePicture = request.getProfilePicture();
        String normalizedProfilePicture = profilePicture == null ? null : profilePicture.trim();
        if (normalizedProfilePicture != null && normalizedProfilePicture.isBlank()) {
            normalizedProfilePicture = null;
        }

        user.setName(trimmedName);
        user.setProfilePicture(normalizedProfilePicture);

        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    /**
     * Upload a profile picture for the authenticated user and persist its public URL.
     */
    public UserDTO uploadCurrentUserProfilePicture(String userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Profile picture file is required");
        }

        if (file.getSize() > MAX_PROFILE_PICTURE_SIZE_BYTES) {
            throw new IllegalArgumentException("Profile picture size must not exceed 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        String originalName = file.getOriginalFilename() == null ? "profile.png" : file.getOriginalFilename();
        String safeOriginalName = Paths.get(originalName).getFileName().toString().replace(" ", "_");
        String storedName = "profile_" + UUID.randomUUID() + "_" + safeOriginalName;

        Path uploadDir = Paths.get("uploads");
        Path outputPath = uploadDir.resolve(storedName).toAbsolutePath();

        try {
            Files.createDirectories(uploadDir);
            file.transferTo(outputPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store profile picture", e);
        }

        String normalizedBaseUrl = serverBaseUrl.endsWith("/")
                ? serverBaseUrl.substring(0, serverBaseUrl.length() - 1)
                : serverBaseUrl;
        user.setProfilePicture(normalizedBaseUrl + "/uploads/" + storedName);

        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    /**
     * Get all users for admin role management.
     */
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update target user's role with basic safety rules.
     */
    public UserDTO updateUserRole(String targetUserId, Role newRole, String actingAdminId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetUserId));

        if (newRole == null) {
            throw new IllegalArgumentException("Role is required");
        }

        if (actingAdminId.equals(targetUserId) && newRole != Role.ADMIN) {
            throw new IllegalArgumentException("You cannot remove your own ADMIN role");
        }

        if (targetUser.getRole() == Role.ADMIN && newRole != Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new IllegalArgumentException("At least one ADMIN user must remain in the system");
            }
        }

        targetUser.setRole(newRole);
        User saved = userRepository.save(targetUser);
        log.info("Updated user {} role to {} by admin {}", targetUserId, newRole, actingAdminId);
        return toDTO(saved);
    }

    /**
     * Convert User entity to UserDTO.
     */
    public UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePicture(),
                user.getRole(),
                user.getProvider()
        );
    }
}
