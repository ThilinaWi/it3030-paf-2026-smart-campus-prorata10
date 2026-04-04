package com.smartcampus.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.smartcampus.auth.config.JwtTokenProvider;
import com.smartcampus.auth.dto.AuthResponse;
import com.smartcampus.auth.dto.UserDTO;
import com.smartcampus.auth.model.Role;
import com.smartcampus.auth.model.User;
import com.smartcampus.auth.repository.UserRepository;
import com.smartcampus.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Service handling authentication logic including Google OAuth token verification,
 * user creation/retrieval, and JWT token generation.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleIdTokenVerifier verifier;

    public AuthService(UserRepository userRepository,
                       JwtTokenProvider jwtTokenProvider,
                       @Value("${app.google.client-id}") String googleClientId) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
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
