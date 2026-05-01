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
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

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

    @SuppressWarnings("unchecked")
    public AuthResponse loginWithGoogle(String accessToken) {

        // The token sent from the frontend may be an ID token (JWT) or an access token.
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> userInfo;
        try {
            if (accessToken != null && accessToken.split("\\.").length == 3) {
                // Probably an ID token (JWT). Use Google's tokeninfo endpoint to decode it.
                String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + accessToken;
                userInfo = restTemplate.getForObject(url, Map.class);
            } else {
                // Fallback: treat it as an access token and call the userinfo endpoint
                String url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
                userInfo = restTemplate.getForObject(url, Map.class);
            }
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de vérifier le token Google: " + ex.getMessage());
        }

        String email = (String) userInfo.get("email");
        String givenName = (String) userInfo.get("given_name");
        String familyName = (String) userInfo.get("family_name");
        String fullName = (String) userInfo.get("name");

        // 2. chercher user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    // populate required fields (nom/prenom). Use given/family name if available,
                    // otherwise fallback
                    String prenom = givenName != null ? givenName : (fullName != null ? fullName : "");
                    String nom = familyName != null ? familyName : "";
                    newUser.setPrenom(prenom);
                    newUser.setNom(nom.isBlank() ? prenom : nom);
                    // Set a random password (hashed) so the motDePasse column is non-null
                    String randomPwd = UUID.randomUUID().toString();
                    newUser.setMotDePasse(passwordEncoder.encode(randomPwd));
                    newUser.setRole(Role.ROLE_STUDENT);
                    newUser.setActif(true);
                    newUser.setDateCreation(LocalDateTime.now());
                    return userRepository.save(newUser);
                });

        // 3. générer JWT
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getEmail())
                .build();
    }
}
