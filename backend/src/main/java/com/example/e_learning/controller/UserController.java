package com.example.e_learning.controller;

import com.example.e_learning.dto.AuthResponse;
import com.example.e_learning.dto.UpdateProfileRequest;
import com.example.e_learning.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:*", allowedHeaders = "*", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            AuthResponse response = userService.updateProfile(email, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }
}
