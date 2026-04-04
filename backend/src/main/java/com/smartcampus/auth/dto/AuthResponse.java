package com.smartcampus.auth.dto;

/**
 * DTO for authentication response containing JWT token and user info.
 */
public class AuthResponse {

    private String token;
    private String tokenType;
    private UserDTO user;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, UserDTO user) {
        this.token = token;
        this.tokenType = tokenType;
        this.user = user;
    }

    public static AuthResponse of(String token, UserDTO user) {
        return new AuthResponse(token, "Bearer", user);
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}
