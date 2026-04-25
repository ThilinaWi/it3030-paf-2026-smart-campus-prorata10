package com.smartcampus.model.dto.request;

import com.smartcampus.model.enums.Role;
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
