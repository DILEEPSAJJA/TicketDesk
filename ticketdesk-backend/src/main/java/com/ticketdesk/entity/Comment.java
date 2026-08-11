package com.ticketdesk.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@EntityListeners(AuditingEntityListener.class)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Comment() {
    }

    public Comment(Long id, Ticket ticket, User createdBy, String message, LocalDateTime createdAt) {
        this.id = id;
        this.ticket = ticket;
        this.createdBy = createdBy;
        this.message = message;
        this.createdAt = createdAt;
    }

    public static CommentBuilder builder() {
        return new CommentBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
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

    public static class CommentBuilder {
        private Long id;
        private Ticket ticket;
        private User createdBy;
        private String message;
        private LocalDateTime createdAt;

        public CommentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CommentBuilder ticket(Ticket ticket) {
            this.ticket = ticket;
            return this;
        }

        public CommentBuilder createdBy(User createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public CommentBuilder message(String message) {
            this.message = message;
            return this;
        }

        public CommentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Comment build() {
            return new Comment(id, ticket, createdBy, message, createdAt);
        }
    }
}
