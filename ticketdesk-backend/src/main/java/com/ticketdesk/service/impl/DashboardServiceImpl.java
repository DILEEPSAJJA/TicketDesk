package com.ticketdesk.service.impl;

import com.ticketdesk.dto.*;
import com.ticketdesk.entity.*;
import com.ticketdesk.repository.TicketRepository;
import com.ticketdesk.security.UserPrincipal;
import com.ticketdesk.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final TicketRepository ticketRepository;

    public DashboardServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardMetrics(UserPrincipal currentUser) {
        log.info("Calculating dashboard metrics for user ID: {} with role: {}", currentUser.getId(), currentUser.getRole());

        boolean isEmployee = currentUser.getRole() == Role.EMPLOYEE;
        Long userId = currentUser.getId();

        // 1. Total Tickets Count
        long totalTickets = isEmployee
                ? ticketRepository.countByCreatedById(userId)
                : ticketRepository.count();

        // 2. Tickets by Status
        List<Object[]> statusCountsRaw = isEmployee
                ? ticketRepository.countTicketsByStatusForUser(userId)
                : ticketRepository.countTicketsByStatus();

        Map<Status, Long> statusMap = new HashMap<>();
        for (Status s : Status.values()) {
            statusMap.put(s, 0L);
        }
        for (Object[] obj : statusCountsRaw) {
            Status s = (Status) obj[0];
            Long count = (Long) obj[1];
            statusMap.put(s, count);
        }
        List<StatusCountDto> statusList = new ArrayList<>();
        for (Status s : Status.values()) {
            statusList.add(new StatusCountDto(s, statusMap.get(s)));
        }

        // 3. Tickets by Priority
        List<Object[]> priorityCountsRaw = isEmployee
                ? ticketRepository.countTicketsByPriorityForUser(userId)
                : ticketRepository.countTicketsByPriority();

        Map<Priority, Long> priorityMap = new HashMap<>();
        for (Priority p : Priority.values()) {
            priorityMap.put(p, 0L);
        }
        for (Object[] obj : priorityCountsRaw) {
            Priority p = (Priority) obj[0];
            Long count = (Long) obj[1];
            priorityMap.put(p, count);
        }
        List<PriorityCountDto> priorityList = new ArrayList<>();
        for (Priority p : Priority.values()) {
            priorityList.add(new PriorityCountDto(p, priorityMap.get(p)));
        }

        // 4. Latest 5 Tickets
        List<Ticket> latestTicketsEntities = isEmployee
                ? ticketRepository.findTop5ByCreatedByIdOrderByCreatedAtDesc(userId)
                : ticketRepository.findTop5ByOrderByCreatedAtDesc();

        List<TicketResponse> latestTickets = latestTicketsEntities.stream()
                .map(this::mapToTicketResponse)
                .toList();

        return DashboardResponse.builder()
                .totalTickets(totalTickets)
                .ticketsByStatus(statusList)
                .ticketsByPriority(priorityList)
                .latestTickets(latestTickets)
                .build();
    }

    private TicketResponse mapToTicketResponse(Ticket ticket) {
        User creator = ticket.getCreatedBy();
        UserResponse creatorDto = UserResponse.builder()
                .id(creator.getId())
                .firstName(creator.getFirstName())
                .lastName(creator.getLastName())
                .email(creator.getEmail())
                .role(creator.getRole())
                .createdAt(creator.getCreatedAt())
                .updatedAt(creator.getUpdatedAt())
                .build();

        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .createdBy(creatorDto)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .commentsCount(ticket.getComments() != null ? ticket.getComments().size() : 0)
                .build();
    }
}
