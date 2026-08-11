package com.ticketdesk.service;

import com.ticketdesk.dto.UserResponse;
import com.ticketdesk.security.UserPrincipal;

public interface UserService {
    UserResponse getCurrentUserProfile(UserPrincipal currentUser);
    UserResponse getUserById(Long id);
}
