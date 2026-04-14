package com.example.e_learning.controller;

import com.example.e_learning.model.*;
import com.example.e_learning.repository.*;
import com.example.e_learning.dto.CourseRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TeacherController {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        long totalCourses = courseRepository.countByFormateurEmail(email);
        long totalStudents = enrollmentRepository.countByCoursFormateurEmail(email);
        
        Map<String, Object> stats = Map.of(
            "totalCourses", totalCourses,
            "totalStudents", totalStudents,
            "averageRating", 4.5,
            "activeCourses", totalCourses
        );
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getMyCourses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(courseRepository.findByFormateurEmail(email));
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseDetails(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return courseRepository.findById(id)
                .filter(course -> course.getFormateur().getEmail().equals(email))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(user -> {
                    Category category = null;
                    if (request.getCategoryId() != null) {
                        category = categoryRepository.findById(request.getCategoryId()).orElse(null);
                    }

                    Course course = Course.builder()
                            .titre(request.getTitre())
                            .description(request.getDescription())
                            .imageUrl(request.getImageUrl())
                            .categorie(category)
                            .formateur(user)
                            .statut(StatutCours.BROUILLON)
                            .build();

                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElseGet(() -> {
                    System.err.println("Utilisateur non trouvé pour l'email: " + email);
                    return ResponseEntity.badRequest().build();
                });
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return courseRepository.findById(id)
                .filter(course -> course.getFormateur().getEmail().equals(email))
                .map(course -> {
                    course.setTitre(request.getTitre());
                    course.setDescription(request.getDescription());
                    course.setImageUrl(request.getImageUrl());
                    if (request.getCategoryId() != null) {
                        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
                        course.setCategorie(category);
                    }
                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return courseRepository.findById(id)
                .filter(course -> course.getFormateur().getEmail().equals(email))
                .map(course -> {
                    courseRepository.delete(course);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Gestion des Leçons ---

    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable Long courseId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return courseRepository.findById(courseId)
                .filter(course -> course.getFormateur().getEmail().equals(email))
                .map(course -> ResponseEntity.ok(lessonRepository.findByCoursIdOrderByOrdreAsc(courseId)))
                .orElse(ResponseEntity.status(403).build());
    }

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<?> addLesson(@PathVariable Long courseId, @RequestBody Lesson lessonRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return courseRepository.findById(courseId)
                .filter(course -> course.getFormateur().getEmail().equals(email))
                .map(course -> {
                    lessonRequest.setCours(course);
                    if (lessonRequest.getOrdre() == null) {
                        int count = lessonRepository.findByCoursIdOrderByOrdreAsc(courseId).size();
                        lessonRequest.setOrdre(count + 1);
                    }
                    return ResponseEntity.ok(lessonRepository.save(lessonRequest));
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable Long id, @RequestBody Lesson lessonRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return lessonRepository.findById(id)
                .filter(lesson -> lesson.getCours().getFormateur().getEmail().equals(email))
                .map(lesson -> {
                    lesson.setTitre(lessonRequest.getTitre());
                    lesson.setContenu(lessonRequest.getContenu());
                    lesson.setVideoUrl(lessonRequest.getVideoUrl());
                    lesson.setOrdre(lessonRequest.getOrdre());
                    return ResponseEntity.ok(lessonRepository.save(lesson));
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @PatchMapping("/courses/{id}/status")
    public ResponseEntity<?> updateCourseStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String statusStr = body.get("status");
        return courseRepository.findById(id)
                .filter(course -> course.getFormateur().getEmail().equals(email))
                .map(course -> {
                    course.setStatut(StatutCours.valueOf(statusStr));
                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        lessonRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/students")
    public ResponseEntity<List<Enrollment>> getMyStudents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(enrollmentRepository.findByCoursFormateurEmail(email));
    }
}

