package com.example.e_learning.controller;

import com.example.e_learning.dto.RegisterRequest;
import com.example.e_learning.dto.AuthResponse;
import com.example.e_learning.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.e_learning.dto.GoogleRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.registerStudent(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.example.e_learning.dto.LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginGoogle(@RequestBody GoogleRequest request) {
        try {
            if (request == null || request.getToken() == null || request.getToken().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.builder().message("Token Google manquant ou invalide").build());
            }

            AuthResponse response = authService.loginWithGoogle(request.getToken());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }
}
