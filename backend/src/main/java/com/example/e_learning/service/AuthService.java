package com.example.e_learning.service;

import com.example.e_learning.dto.RegisterRequest;
import com.example.e_learning.dto.AuthResponse;
import com.example.e_learning.model.Role;
import com.example.e_learning.model.User;
import com.example.e_learning.repository.UserRepository;
import com.example.e_learning.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        // Créer l'utilisateur avec forçage du rôle
        User newUser = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse())) // Hachage avec BCrypt
                .role(Role.ROLE_STUDENT)
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(newUser);
        String jwtToken = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .message("Inscription réussie")
                .token(jwtToken)
                .role(savedUser.getRole().name())
                .nom(savedUser.getNom())
                .prenom(savedUser.getPrenom())
                .email(savedUser.getEmail())
                .build();
    }

    public AuthResponse login(com.example.e_learning.dto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getMotDePasse(), user.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .message("Connexion réussie")
                .token(jwtToken)
                .role(user.getRole().name())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .build();
    }
}
