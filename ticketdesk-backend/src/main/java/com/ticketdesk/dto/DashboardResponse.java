package com.ticketdesk.dto;

import java.util.List;

public class DashboardResponse {

    private long totalTickets;
    private List<StatusCountDto> ticketsByStatus;
    private List<PriorityCountDto> ticketsByPriority;
    private List<TicketResponse> latestTickets;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalTickets, List<StatusCountDto> ticketsByStatus, List<PriorityCountDto> ticketsByPriority, List<TicketResponse> latestTickets) {
        this.totalTickets = totalTickets;
        this.ticketsByStatus = ticketsByStatus;
        this.ticketsByPriority = ticketsByPriority;
        this.latestTickets = latestTickets;
    }

    public static DashboardResponseBuilder builder() {
        return new DashboardResponseBuilder();
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public List<StatusCountDto> getTicketsByStatus() {
        return ticketsByStatus;
    }

    public void setTicketsByStatus(List<StatusCountDto> ticketsByStatus) {
        this.ticketsByStatus = ticketsByStatus;
    }

    public List<PriorityCountDto> getTicketsByPriority() {
        return ticketsByPriority;
    }

    public void setTicketsByPriority(List<PriorityCountDto> ticketsByPriority) {
        this.ticketsByPriority = ticketsByPriority;
    }

    public List<TicketResponse> getLatestTickets() {
        return latestTickets;
    }

    public void setLatestTickets(List<TicketResponse> latestTickets) {
        this.latestTickets = latestTickets;
    }

    public static class DashboardResponseBuilder {
        private long totalTickets;
        private List<StatusCountDto> ticketsByStatus;
        private List<PriorityCountDto> ticketsByPriority;
        private List<TicketResponse> latestTickets;

        public DashboardResponseBuilder totalTickets(long totalTickets) {
            this.totalTickets = totalTickets;
            return this;
        }

        public DashboardResponseBuilder ticketsByStatus(List<StatusCountDto> ticketsByStatus) {
            this.ticketsByStatus = ticketsByStatus;
            return this;
        }

        public DashboardResponseBuilder ticketsByPriority(List<PriorityCountDto> ticketsByPriority) {
            this.ticketsByPriority = ticketsByPriority;
            return this;
        }

        public DashboardResponseBuilder latestTickets(List<TicketResponse> latestTickets) {
            this.latestTickets = latestTickets;
            return this;
        }

        public DashboardResponse build() {
            return new DashboardResponse(totalTickets, ticketsByStatus, ticketsByPriority, latestTickets);
        }
    }
}
