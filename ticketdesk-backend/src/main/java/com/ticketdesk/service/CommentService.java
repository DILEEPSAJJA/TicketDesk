package com.ticketdesk.service;

import com.ticketdesk.dto.CommentRequest;
import com.ticketdesk.dto.CommentResponse;
import com.ticketdesk.security.UserPrincipal;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(Long ticketId, CommentRequest request, UserPrincipal currentUser);
    List<CommentResponse> getCommentsByTicketId(Long ticketId, UserPrincipal currentUser);
}
