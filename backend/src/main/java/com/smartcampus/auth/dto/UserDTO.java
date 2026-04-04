package com.smartcampus.auth.dto;

import com.smartcampus.auth.model.Role;

/**
 * DTO for returning safe user information to the client.
 */
public class UserDTO {

    private String id;
    private String name;
    private String email;
    private String profilePicture;
    private Role role;
    private String provider;

    public UserDTO() {}

    public UserDTO(String id, String name, String email, String profilePicture, Role role, String provider) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
        this.role = role;
        this.provider = provider;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
}
