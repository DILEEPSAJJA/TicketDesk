package com.ticketdesk.controller;

import com.ticketdesk.dto.PagedResponse;
import com.ticketdesk.dto.TicketRequest;
import com.ticketdesk.dto.TicketResponse;
import com.ticketdesk.entity.Category;
import com.ticketdesk.entity.Priority;
import com.ticketdesk.entity.Status;
import com.ticketdesk.security.UserPrincipal;
import com.ticketdesk.service.TicketService;
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

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Ticket Management", description = "Endpoints for creating, listing, searching, updating, and deleting support tickets")
@SecurityRequirement(name = "bearerAuth")
public class TicketController {

    private static final Logger log = LoggerFactory.getLogger(TicketController.class);

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @Operation(summary = "Create a new ticket", description = "Allows an authenticated user to submit a new support ticket")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request by user ID {} to create ticket: {}", currentUser.getId(), request.getTitle());
        TicketResponse response = ticketService.createTicket(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get paginated list of tickets", description = "Retrieve tickets with search, status, priority, category filtering, and pagination")
    public ResponseEntity<PagedResponse<TicketResponse>> getTickets(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Long createdBy,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request to fetch tickets by user ID {}", currentUser.getId());
        PagedResponse<TicketResponse> response = ticketService.getTickets(
                status, priority, category, createdBy, search, page, size, sortBy, sortDir, currentUser
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ticket details by ID", description = "Retrieve complete details for a specific ticket by its ID")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request to fetch ticket ID {} by user ID {}", id, currentUser.getId());
        TicketResponse response = ticketService.getTicketById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update ticket details", description = "Modify title, description, category, priority, or status of an existing ticket")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request to update ticket ID {} by user ID {}", id, currentUser.getId());
        TicketResponse response = ticketService.updateTicket(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a ticket", description = "Permanently remove a ticket by ID")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request to delete ticket ID {} by user ID {}", id, currentUser.getId());
        ticketService.deleteTicket(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
