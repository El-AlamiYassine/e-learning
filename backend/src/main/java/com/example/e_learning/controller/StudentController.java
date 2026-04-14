package com.example.e_learning.controller;

import com.example.e_learning.dto.CourseDetailDTO;
import com.example.e_learning.dto.CourseProgressDTO;
import com.example.e_learning.dto.StudentDashboardDTO;
import com.example.e_learning.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.e_learning.model.Category;
import com.example.e_learning.model.Course;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<StudentDashboardDTO> getDashboardSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(studentService.getDashboardSummary(email));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseProgressDTO>> getEnrolledCourses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(studentService.getEnrolledCourses(email));
    }

    @GetMapping("/catalog")
    public ResponseEntity<List<Course>> getCatalog(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(studentService.getAvailableCourses(categoryId));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(studentService.getAllCategories());
    }

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<?> enroll(@PathVariable Long courseId, Authentication authentication) {
        try {
            studentService.enroll(courseId, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Inscription réussie"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/courses/{courseId}/detail")
    public ResponseEntity<CourseDetailDTO> getCourseDetail(@PathVariable Long courseId, Authentication authentication) {
        return ResponseEntity.ok(studentService.getCourseDetail(courseId, authentication.getName()));
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<?> completeLesson(@PathVariable Long lessonId, Authentication authentication) {
        try {
            studentService.completeLesson(lessonId, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Leçon marquée comme terminée"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
