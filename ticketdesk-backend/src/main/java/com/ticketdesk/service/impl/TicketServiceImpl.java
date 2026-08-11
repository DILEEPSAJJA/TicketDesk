package com.ticketdesk.service.impl;

import com.ticketdesk.dto.PagedResponse;
import com.ticketdesk.dto.TicketRequest;
import com.ticketdesk.dto.TicketResponse;
import com.ticketdesk.dto.UserResponse;
import com.ticketdesk.entity.*;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.exception.UnauthorizedException;
import com.ticketdesk.repository.TicketRepository;
import com.ticketdesk.repository.UserRepository;
import com.ticketdesk.security.UserPrincipal;
import com.ticketdesk.service.TicketService;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketServiceImpl.class);

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketServiceImpl(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public TicketResponse createTicket(TicketRequest request, UserPrincipal currentUser) {
        log.info("Creating new ticket by user ID: {}, title: {}", currentUser.getId(), request.getTitle());

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Status initialStatus = request.getStatus() != null ? request.getStatus() : Status.OPEN;

        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(initialStatus)
                .createdBy(user)
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);
        log.info("Successfully created ticket ID: {}", savedTicket.getId());

        return mapToTicketResponse(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TicketResponse> getTickets(
            Status status,
            Priority priority,
            Category category,
            Long createdBy,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir,
            UserPrincipal currentUser) {

        log.info("Fetching tickets page: {}, size: {}, status: {}, priority: {}, category: {}, search: {}",
                page, size, status, priority, category, search);

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Ticket> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // If EMPLOYEE role, restrict to tickets created by this employee
            if (currentUser.getRole() == Role.EMPLOYEE) {
                predicates.add(criteriaBuilder.equal(root.get("createdBy").get("id"), currentUser.getId()));
            } else if (createdBy != null) {
                predicates.add(criteriaBuilder.equal(root.get("createdBy").get("id"), createdBy));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (priority != null) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), priority));
            }
            if (category != null) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                predicates.add(criteriaBuilder.or(titleLike, descLike));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Ticket> ticketsPage = ticketRepository.findAll(spec, pageable);

        List<TicketResponse> content = ticketsPage.getContent().stream()
                .map(this::mapToTicketResponse)
                .toList();

        return PagedResponse.<TicketResponse>builder()
                .content(content)
                .pageNo(ticketsPage.getNumber())
                .pageSize(ticketsPage.getSize())
                .totalElements(ticketsPage.getTotalElements())
                .totalPages(ticketsPage.getTotalPages())
                .last(ticketsPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id, UserPrincipal currentUser) {
        log.info("Fetching ticket ID: {} for user ID: {}", id, currentUser.getId());
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        // Security check: EMPLOYEE can only view their own ticket
        if (currentUser.getRole() == Role.EMPLOYEE && !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to view this ticket");
        }

        return mapToTicketResponse(ticket);
    }

    @Override
    @Transactional
    public TicketResponse updateTicket(Long id, TicketRequest request, UserPrincipal currentUser) {
        log.info("Updating ticket ID: {} by user ID: {}", id, currentUser.getId());
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        // Security check
        if (currentUser.getRole() == Role.EMPLOYEE && !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this ticket");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            ticket.setTitle(request.getTitle());
        }
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            ticket.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            ticket.setCategory(request.getCategory());
        }
        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        log.info("Successfully updated ticket ID: {}", updatedTicket.getId());

        return mapToTicketResponse(updatedTicket);
    }

    @Override
    @Transactional
    public void deleteTicket(Long id, UserPrincipal currentUser) {
        log.info("Deleting ticket ID: {} by user ID: {}", id, currentUser.getId());
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        // Security check: Only ADMIN, SUPPORT, or ticket author can delete
        if (currentUser.getRole() == Role.EMPLOYEE && !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this ticket");
        }

        ticketRepository.delete(ticket);
        log.info("Successfully deleted ticket ID: {}", id);
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
