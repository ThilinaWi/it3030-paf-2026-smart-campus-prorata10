package com.smartcampus.notification.service;

import com.smartcampus.model.entity.Notification;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.model.enums.Role;
import com.smartcampus.repository.NotificationRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void createNotificationsForRole_shouldCreateForEveryAdminUser() {
        User admin1 = new User();
        admin1.setId("admin-1");
        admin1.setRole(Role.ADMIN);

        User admin2 = new User();
        admin2.setId("admin-2");
        admin2.setRole(Role.ADMIN);

        when(userRepository.findAllByRole(Role.ADMIN)).thenReturn(List.of(admin1, admin2));

        notificationService.createNotificationsForRole(Role.ADMIN, NotificationType.ALERT, "New booking request");

        ArgumentCaptor<List<Notification>> listCaptor = ArgumentCaptor.forClass(List.class);
        verify(notificationRepository).saveAll(listCaptor.capture());

        List<Notification> saved = listCaptor.getValue();
        assertEquals(2, saved.size());
        assertEquals("admin-1", saved.get(0).getUserId());
        assertEquals("admin-2", saved.get(1).getUserId());
        assertEquals(NotificationType.ALERT, saved.get(0).getType());
        assertEquals("New booking request", saved.get(0).getMessage());
    }

    @Test
    void createNotificationsForRole_shouldSkipWhenNoUsersForRole() {
        when(userRepository.findAllByRole(Role.ADMIN)).thenReturn(List.of());

        notificationService.createNotificationsForRole(Role.ADMIN, NotificationType.ALERT, "No admins");

        verify(notificationRepository, never()).saveAll(anyList());
    }
}
