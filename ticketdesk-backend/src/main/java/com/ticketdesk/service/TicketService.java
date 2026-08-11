package com.ticketdesk.service;

import com.ticketdesk.dto.PagedResponse;
import com.ticketdesk.dto.TicketRequest;
import com.ticketdesk.dto.TicketResponse;
import com.ticketdesk.entity.Category;
import com.ticketdesk.entity.Priority;
import com.ticketdesk.entity.Status;
import com.ticketdesk.security.UserPrincipal;

public interface TicketService {
    TicketResponse createTicket(TicketRequest request, UserPrincipal currentUser);
    
    PagedResponse<TicketResponse> getTickets(
            Status status,
            Priority priority,
            Category category,
            Long createdBy,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir,
            UserPrincipal currentUser
    );

    TicketResponse getTicketById(Long id, UserPrincipal currentUser);

    TicketResponse updateTicket(Long id, TicketRequest request, UserPrincipal currentUser);

    void deleteTicket(Long id, UserPrincipal currentUser);
}
