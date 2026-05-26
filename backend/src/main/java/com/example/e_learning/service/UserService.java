package com.example.e_learning.service;

import com.example.e_learning.dto.AuthResponse;
import com.example.e_learning.dto.UpdateProfileRequest;
import com.example.e_learning.model.User;
import com.example.e_learning.repository.UserRepository;
import com.example.e_learning.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (request.getNom() != null && !request.getNom().isBlank()) {
            user.setNom(request.getNom());
        }
        if (request.getPrenom() != null && !request.getPrenom().isBlank()) {
            user.setPrenom(request.getPrenom());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Check if new email is already taken by someone else
            if (!request.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est déjà utilisé");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getMotDePasse() != null && !request.getMotDePasse().isBlank()) {
            user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        }

        User updatedUser = userRepository.save(user);
        
        // Generate a new token since email might have changed, or just to refresh it
        String newToken = jwtService.generateToken(updatedUser);

        return AuthResponse.builder()
                .message("Profil mis à jour avec succès")
                .token(newToken)
                .role(updatedUser.getRole().name())
                .nom(updatedUser.getNom())
                .prenom(updatedUser.getPrenom())
                .email(updatedUser.getEmail())
                .build();
    }
}
