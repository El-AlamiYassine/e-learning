package com.example.e_learning.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    // confirmationMotDePasse est ignoré par le backend
}
