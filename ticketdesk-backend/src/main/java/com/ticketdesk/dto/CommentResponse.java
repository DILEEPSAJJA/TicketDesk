package com.ticketdesk.dto;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private Long ticketId;
    private UserResponse createdBy;
    private String message;
    private LocalDateTime createdAt;

    public CommentResponse() {
    }

    public CommentResponse(Long id, Long ticketId, UserResponse createdBy, String message, LocalDateTime createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.createdBy = createdBy;
        this.message = message;
        this.createdAt = createdAt;
    }

    public static CommentResponseBuilder builder() {
        return new CommentResponseBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class CommentResponseBuilder {
        private Long id;
        private Long ticketId;
        private UserResponse createdBy;
        private String message;
        private LocalDateTime createdAt;

        public CommentResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CommentResponseBuilder ticketId(Long ticketId) {
            this.ticketId = ticketId;
            return this;
        }

        public CommentResponseBuilder createdBy(UserResponse createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public CommentResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public CommentResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public CommentResponse build() {
            return new CommentResponse(id, ticketId, createdBy, message, createdAt);
        }
    }
}
