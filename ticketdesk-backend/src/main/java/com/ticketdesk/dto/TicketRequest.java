package com.ticketdesk.dto;

import com.ticketdesk.entity.Category;
import com.ticketdesk.entity.Priority;
import com.ticketdesk.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 150, message = "Title must be between 3 and 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private Status status;

    public TicketRequest() {
    }

    public TicketRequest(String title, String description, Category category, Priority priority, Status status) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
    }

    public static TicketRequestBuilder builder() {
        return new TicketRequestBuilder();
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

    public static class TicketRequestBuilder {
        private String title;
        private String description;
        private Category category;
        private Priority priority;
        private Status status;

        public TicketRequestBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TicketRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TicketRequestBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public TicketRequestBuilder priority(Priority priority) {
            this.priority = priority;
            return this;
        }

        public TicketRequestBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public TicketRequest build() {
            return new TicketRequest(title, description, category, priority, status);
        }
    }
}
