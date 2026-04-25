package com.smartcampus.controller;

import com.smartcampus.model.dto.request.UpdateNotificationPreferencesRequest;
import com.smartcampus.model.dto.response.NotificationPreferencesResponse;
import com.smartcampus.model.entity.User;
import com.smartcampus.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/preferences")
public class UserPreferenceController {

    private final UserRepository userRepository;

    public UserPreferenceController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<NotificationPreferencesResponse> getPreferences(@AuthenticationPrincipal User user) {
        User persistedUser = userRepository.findById(user.getId()).orElse(user);
        User.NotificationPreferences prefs = persistedUser.getNotificationPreferences();
        return ResponseEntity.ok(toResponse(prefs));
    }

    @PutMapping
    public ResponseEntity<NotificationPreferencesResponse> updatePreferences(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateNotificationPreferencesRequest request) {
        User persistedUser = userRepository.findById(user.getId()).orElse(user);
        User.NotificationPreferences prefs = persistedUser.getNotificationPreferences();

        if (request.getStatusUpdates() != null) {
            prefs.setStatusUpdates(request.getStatusUpdates());
        }
        if (request.getTechnicianUpdates() != null) {
            prefs.setTechnicianUpdates(request.getTechnicianUpdates());
        }
        if (request.getAssignments() != null) {
            prefs.setAssignments(request.getAssignments());
        }
        if (request.getSystem() != null) {
            prefs.setSystem(request.getSystem());
        }

        persistedUser.setNotificationPreferences(prefs);
        userRepository.save(persistedUser);

        return ResponseEntity.ok(toResponse(prefs));
    }

    private NotificationPreferencesResponse toResponse(User.NotificationPreferences prefs) {
        return new NotificationPreferencesResponse(
                prefs.isStatusUpdates(),
                prefs.isTechnicianUpdates(),
                prefs.isAssignments(),
                prefs.isSystem()
        );
    }
}
