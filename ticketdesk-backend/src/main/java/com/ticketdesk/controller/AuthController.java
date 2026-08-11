package com.ticketdesk.controller;

import com.ticketdesk.dto.AuthRequest;
import com.ticketdesk.dto.AuthResponse;
import com.ticketdesk.dto.RegisterRequest;
import com.ticketdesk.dto.UserResponse;
import com.ticketdesk.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Management", description = "Endpoints for user registration and JWT login")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account with role ADMIN, SUPPORT, or EMPLOYEE")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("REST request to register user with email: {}", registerRequest.getEmail());
        UserResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token", description = "Validates user credentials and returns a Bearer JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        log.info("REST request to authenticate user with email: {}", authRequest.getEmail());
        AuthResponse response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }
}
