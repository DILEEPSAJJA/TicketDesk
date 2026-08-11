package com.ticketdesk.service;

import com.ticketdesk.dto.AuthRequest;
import com.ticketdesk.dto.AuthResponse;
import com.ticketdesk.dto.RegisterRequest;
import com.ticketdesk.dto.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest registerRequest);
    AuthResponse login(AuthRequest authRequest);
}
