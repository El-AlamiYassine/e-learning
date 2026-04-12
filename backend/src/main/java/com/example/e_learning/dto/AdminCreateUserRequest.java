package com.example.e_learning.dto;

import com.example.e_learning.model.Role;
import lombok.Data;

@Data
public class AdminCreateUserRequest {
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private Role role;
}
