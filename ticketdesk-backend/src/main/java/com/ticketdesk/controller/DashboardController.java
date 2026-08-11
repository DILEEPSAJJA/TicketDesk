package com.ticketdesk.controller;

import com.ticketdesk.dto.DashboardResponse;
import com.ticketdesk.security.UserPrincipal;
import com.ticketdesk.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Endpoints for dashboard metrics and summary analytics")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @Operation(summary = "Get dashboard metrics", description = "Returns total tickets, status breakdown, priority breakdown, and latest tickets")
    public ResponseEntity<DashboardResponse> getDashboardMetrics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("REST request to fetch dashboard metrics for user ID {}", currentUser.getId());
        DashboardResponse response = dashboardService.getDashboardMetrics(currentUser);
        return ResponseEntity.ok(response);
    }
}
