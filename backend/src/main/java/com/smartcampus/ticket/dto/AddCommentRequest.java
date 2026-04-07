package com.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;

public class AddCommentRequest {

    @NotBlank(message = "Comment text is required")
    private String commentText;

    @NotBlank(message = "Commented by is required")
    private String commentedBy;

    public AddCommentRequest() {
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public String getCommentedBy() {
        return commentedBy;
    }

    public void setCommentedBy(String commentedBy) {
        this.commentedBy = commentedBy;
    }
}