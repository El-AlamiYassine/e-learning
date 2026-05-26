package com.example.e_learning.config;

import com.example.e_learning.model.User;
import com.example.e_learning.model.Role;
import com.example.e_learning.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {

        return args -> {

            // ADMIN
            if (userRepository.findByEmail("admin@elearning.com").isEmpty()) {
                User admin = new User();
                admin.setNom("Admin");
                admin.setPrenom("Admin");
                admin.setEmail("admin@elearning.com");
                admin.setMotDePasse(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ROLE_ADMIN);

                userRepository.save(admin);
                System.out.println("✅ Admin created");
            }

            // TEACHER
            if (userRepository.findByEmail("prof@elearning.com").isEmpty()) {
                User prof = new User();
                prof.setNom("Prof");
                prof.setPrenom("Prof");
                prof.setEmail("prof@elearning.com");
                prof.setMotDePasse(passwordEncoder.encode("prof1234"));
                prof.setRole(Role.ROLE_TEACHER);

                userRepository.save(prof);
                System.out.println("✅ Professor created");
            }
        };
    }
}