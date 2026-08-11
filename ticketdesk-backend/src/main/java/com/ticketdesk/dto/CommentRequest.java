package com.ticketdesk.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentRequest {

    @NotBlank(message = "Message is required")
    private String message;

    public CommentRequest() {
    }

    public CommentRequest(String message) {
        this.message = message;
    }

    public static CommentRequestBuilder builder() {
        return new CommentRequestBuilder();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static class CommentRequestBuilder {
        private String message;

        public CommentRequestBuilder message(String message) {
            this.message = message;
            return this;
        }

        public CommentRequest build() {
            return new CommentRequest(message);
        }
    }
}
