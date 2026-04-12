package com.example.e_learning.controller;

import com.example.e_learning.model.Course;
import com.example.e_learning.model.StatutCours;
import com.example.e_learning.model.User;
import com.example.e_learning.model.Role;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.UserRepository;
import com.example.e_learning.dto.AdminCreateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.example.e_learning.model.SystemSetting;
import com.example.e_learning.repository.SystemSettingRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemSettingRepository systemSettingRepository;

    @GetMapping("/settings/maintenance")
    public ResponseEntity<?> getMaintenanceStatus() {
        String status = systemSettingRepository.findById("maintenance_mode")
                .map(SystemSetting::getValeur)
                .orElse("false");
        return ResponseEntity.ok(Map.of("maintenanceMode", Boolean.parseBoolean(status)));
    }

    @PatchMapping("/settings/maintenance")
    public ResponseEntity<?> updateMaintenanceStatus(@RequestBody Map<String, Boolean> body) {
        boolean active = body.get("maintenanceMode");
        SystemSetting setting = SystemSetting.builder()
                .cle("maintenance_mode")
                .valeur(String.valueOf(active))
                .build();
        systemSettingRepository.save(setting);
        return ResponseEntity.ok(Map.of("maintenanceMode", active));
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody AdminCreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cet email est déjà utilisé"));
        }

        User newUser = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(request.getRole())
                .actif(true)
                .build();

        userRepository.save(newUser);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Long> stats = Map.of(
            "totalUsers", userRepository.count(),
            "totalCourses", courseRepository.count(),
            "pendingCourses", courseRepository.findAll().stream()
                .filter(c -> c.getStatut() == StatutCours.BROUILLON).count()
        );
        return ResponseEntity.ok(stats);
    }

    // --- User Management ---

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newRoleStr = body.get("role");
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(Role.valueOf(newRoleStr));
                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Course Moderation ---

    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @PatchMapping("/courses/{id}/status")
    public ResponseEntity<?> updateCourseStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        return courseRepository.findById(id)
                .map(course -> {
                    course.setStatut(StatutCours.valueOf(statusStr));
                    courseRepository.save(course);
                    return ResponseEntity.ok(course);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
