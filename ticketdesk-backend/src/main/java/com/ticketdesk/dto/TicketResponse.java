package com.ticketdesk.dto;

import com.ticketdesk.entity.Category;
import com.ticketdesk.entity.Priority;
import com.ticketdesk.entity.Status;

import java.time.LocalDateTime;

public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private Category category;
    private Priority priority;
    private Status status;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int commentsCount;

    public TicketResponse() {
    }

    public TicketResponse(Long id, String title, String description, Category category, Priority priority, Status status, UserResponse createdBy, LocalDateTime createdAt, LocalDateTime updatedAt, int commentsCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.commentsCount = commentsCount;
    }

    public static TicketResponseBuilder builder() {
        return new TicketResponseBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(int commentsCount) {
        this.commentsCount = commentsCount;
    }

    public static class TicketResponseBuilder {
        private Long id;
        private String title;
        private String description;
        private Category category;
        private Priority priority;
        private Status status;
        private UserResponse createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private int commentsCount;

        public TicketResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TicketResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TicketResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TicketResponseBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public TicketResponseBuilder priority(Priority priority) {
            this.priority = priority;
            return this;
        }

        public TicketResponseBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public TicketResponseBuilder createdBy(UserResponse createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public TicketResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TicketResponseBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public TicketResponseBuilder commentsCount(int commentsCount) {
            this.commentsCount = commentsCount;
            return this;
        }

        public TicketResponse build() {
            return new TicketResponse(id, title, description, category, priority, status, createdBy, createdAt, updatedAt, commentsCount);
        }
    }
}
