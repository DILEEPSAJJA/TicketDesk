package com.ticketdesk.service;

import com.ticketdesk.dto.DashboardResponse;
import com.ticketdesk.security.UserPrincipal;

public interface DashboardService {
    DashboardResponse getDashboardMetrics(UserPrincipal currentUser);
}
