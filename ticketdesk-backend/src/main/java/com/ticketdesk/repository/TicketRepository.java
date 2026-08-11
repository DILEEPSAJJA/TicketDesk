package com.ticketdesk.repository;

import com.ticketdesk.entity.Priority;
import com.ticketdesk.entity.Status;
import com.ticketdesk.entity.Ticket;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

    @Query("SELECT t.status AS status, COUNT(t) AS count FROM Ticket t GROUP BY t.status")
    List<Object[]> countTicketsByStatus();

    @Query("SELECT t.priority AS priority, COUNT(t) AS count FROM Ticket t GROUP BY t.priority")
    List<Object[]> countTicketsByPriority();

    @Query("SELECT t.status AS status, COUNT(t) AS count FROM Ticket t WHERE t.createdBy.id = :userId GROUP BY t.status")
    List<Object[]> countTicketsByStatusForUser(@Param("userId") Long userId);

    @Query("SELECT t.priority AS priority, COUNT(t) AS count FROM Ticket t WHERE t.createdBy.id = :userId GROUP BY t.priority")
    List<Object[]> countTicketsByPriorityForUser(@Param("userId") Long userId);

    long countByCreatedById(Long userId);

    List<Ticket> findTop5ByOrderByCreatedAtDesc();

    List<Ticket> findTop5ByCreatedByIdOrderByCreatedAtDesc(Long userId);
}
