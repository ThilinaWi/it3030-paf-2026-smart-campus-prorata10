package com.smartcampus.auth.dto;

import com.smartcampus.auth.model.Role;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for admin role updates.
 */
public class UpdateUserRoleRequest {

    @NotNull(message = "Role is required")
    private Role role;

    public UpdateUserRoleRequest() {}

    public UpdateUserRoleRequest(Role role) {
        this.role = role;
    }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
