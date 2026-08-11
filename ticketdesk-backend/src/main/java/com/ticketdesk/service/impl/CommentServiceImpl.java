package com.ticketdesk.service.impl;

import com.ticketdesk.dto.CommentRequest;
import com.ticketdesk.dto.CommentResponse;
import com.ticketdesk.dto.UserResponse;
import com.ticketdesk.entity.Comment;
import com.ticketdesk.entity.Role;
import com.ticketdesk.entity.Ticket;
import com.ticketdesk.entity.User;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.exception.UnauthorizedException;
import com.ticketdesk.repository.CommentRepository;
import com.ticketdesk.repository.TicketRepository;
import com.ticketdesk.repository.UserRepository;
import com.ticketdesk.security.UserPrincipal;
import com.ticketdesk.service.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private static final Logger log = LoggerFactory.getLogger(CommentServiceImpl.class);

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(CommentRepository commentRepository,
                              TicketRepository ticketRepository,
                              UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CommentResponse addComment(Long ticketId, CommentRequest request, UserPrincipal currentUser) {
        log.info("Adding comment to ticket ID: {} by user ID: {}", ticketId, currentUser.getId());

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        // Security check: EMPLOYEE can only comment on their own tickets
        if (currentUser.getRole() == Role.EMPLOYEE && !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to comment on this ticket");
        }

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Comment comment = Comment.builder()
                .ticket(ticket)
                .createdBy(user)
                .message(request.getMessage())
                .build();

        Comment savedComment = commentRepository.save(comment);
        log.info("Successfully added comment ID: {} to ticket ID: {}", savedComment.getId(), ticketId);

        return mapToCommentResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTicketId(Long ticketId, UserPrincipal currentUser) {
        log.info("Fetching comments for ticket ID: {} by user ID: {}", ticketId, currentUser.getId());

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        if (currentUser.getRole() == Role.EMPLOYEE && !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to view comments for this ticket");
        }

        List<Comment> comments = commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);

        return comments.stream()
                .map(this::mapToCommentResponse)
                .toList();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        User creator = comment.getCreatedBy();
        UserResponse creatorDto = UserResponse.builder()
                .id(creator.getId())
                .firstName(creator.getFirstName())
                .lastName(creator.getLastName())
                .email(creator.getEmail())
                .role(creator.getRole())
                .createdAt(creator.getCreatedAt())
                .updatedAt(creator.getUpdatedAt())
                .build();

        return CommentResponse.builder()
                .id(comment.getId())
                .ticketId(comment.getTicket().getId())
                .createdBy(creatorDto)
                .message(comment.getMessage())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
