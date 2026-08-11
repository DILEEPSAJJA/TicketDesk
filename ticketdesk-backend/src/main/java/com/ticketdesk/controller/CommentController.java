package com.ticketdesk.controller;

import com.ticketdesk.dto.CommentRequest;
import com.ticketdesk.dto.CommentResponse;
import com.ticketdesk.security.UserPrincipal;
import com.ticketdesk.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@Tag(name = "Comment Management", description = "Endpoints for posting and viewing comments on tickets")
@SecurityRequirement(name = "bearerAuth")
public class CommentController {

    private static final Logger log = LoggerFactory.getLogger(CommentController.class);

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    @Operation(summary = "Add a comment to a ticket", description = "Allows an authenticated user to post a comment/update to a ticket")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request by user ID {} to add comment to ticket ID {}", currentUser.getId(), ticketId);
        CommentResponse response = commentService.addComment(ticketId, request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get comments for a ticket", description = "Retrieve all comments associated with a specific ticket in chronological order")
    public ResponseEntity<List<CommentResponse>> getCommentsByTicketId(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request by user ID {} to fetch comments for ticket ID {}", currentUser.getId(), ticketId);
        List<CommentResponse> comments = commentService.getCommentsByTicketId(ticketId, currentUser);
        return ResponseEntity.ok(comments);
    }
}
