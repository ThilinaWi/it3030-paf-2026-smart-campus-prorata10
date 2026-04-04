package com.smartcampus.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for receiving Google OAuth token from the frontend.
 */
public class GoogleTokenRequest {

    @NotBlank(message = "Google token is required")
    private String token;

    public GoogleTokenRequest() {}

    public GoogleTokenRequest(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
