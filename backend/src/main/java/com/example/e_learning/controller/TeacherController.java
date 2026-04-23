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
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@Slf4j
public class TeacherController {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final CommentRepository commentRepository;
    private final ProgressRepository progressRepository;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        long totalCourses = courseRepository.countByFormateurEmail(email);
        long totalStudents = enrollmentRepository.countByCoursFormateurEmail(email);
        
        Double totalRevenue = enrollmentRepository.getTotalRevenueByTeacherEmail(email);
        if (totalRevenue == null) totalRevenue = 0.0;

        // Monthly revenue for the last 12 months
        List<Enrollment> enrollments = enrollmentRepository.findByCoursFormateurEmailOrderByDateInscriptionAsc(email);
        java.time.LocalDate now = java.time.LocalDate.now();
        double[] monthlyRevenues = new double[12];
        for (Enrollment e : enrollments) {
            java.time.LocalDateTime date = e.getDateInscription();
            if (date.isAfter(now.minusMonths(12).atStartOfDay())) {
                int monthDiff = (int) java.time.temporal.ChronoUnit.MONTHS.between(
                    date.toLocalDate().withDayOfMonth(1), 
                    now.withDayOfMonth(1)
                );
                if (monthDiff >= 0 && monthDiff < 12) {
                    int index = 11 - monthDiff;
                    monthlyRevenues[index] += (e.getCours().getPrix() != null ? e.getCours().getPrix() : 0.0);
                }
            }
        }

        // Engagement calculation
        long completedLessons = progressRepository.countCompletedLessonsByTeacherEmail(email);
        long totalPotentialLessons = progressRepository.countTotalPotentialLessonsByTeacherEmail(email);
        int engagement = totalPotentialLessons > 0 ? (int) ((completedLessons * 100) / totalPotentialLessons) : 0;

        // Average Rating
        Double avgRating = commentRepository.getAverageRatingByTeacherEmail(email);
        if (avgRating == null) avgRating = 0.0;
        long totalReviews = commentRepository.countByTeacherEmail(email);

        // Most followed course
        List<Course> courses = courseRepository.findByFormateurEmail(email);
        String topCourse = "Aucun";
        long maxEnrollments = -1;
        for (Course c : courses) {
            long count = enrollmentRepository.findAll().stream().filter(e -> e.getCours().getId().equals(c.getId())).count();
            if (count > maxEnrollments) {
                maxEnrollments = count;
                topCourse = c.getTitre();
            }
        }
        
        Map<String, Object> stats = Map.of(
            "totalCourses", totalCourses,
            "totalStudents", totalStudents,
            "totalRevenue", totalRevenue,
            "monthlyRevenues", monthlyRevenues,
            "engagement", engagement,
            "averageRating", Math.round(avgRating * 10.0) / 10.0,
            "totalReviews", totalReviews,
            "topCourse", topCourse
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
                            .prix(request.getPrix())
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
                    course.setPrix(request.getPrix());
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
                .map(course -> {
                    if (course.getFormateur().getEmail().equals(email)) {
                        return ResponseEntity.ok(lessonRepository.findByCoursIdOrderByOrdreAsc(courseId));
                    } else {
                        return ResponseEntity.status(403).<List<Lesson>>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<?> addLesson(@PathVariable Long courseId, @RequestBody Lesson lessonRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return courseRepository.findById(courseId)
                .map(course -> {
                    if (course.getFormateur().getEmail().equals(email)) {
                        lessonRequest.setCours(course);
                        if (lessonRequest.getOrdre() == null) {
                            int count = lessonRepository.findByCoursIdOrderByOrdreAsc(courseId).size();
                            lessonRequest.setOrdre(count + 1);
                        }
                        if (lessonRequest.getDocuments() != null) {
                            lessonRequest.getDocuments().forEach(doc -> doc.setLesson(lessonRequest));
                        }
                        return ResponseEntity.ok(lessonRepository.save(lessonRequest));
                    } else {
                        return ResponseEntity.status(403).body("Vous n'êtes pas autorisé à modifier ce cours");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
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
                    
                    if (lessonRequest.getDocuments() != null) {
                        if (lesson.getDocuments() != null) {
                            lesson.getDocuments().clear();
                        }
                        lessonRequest.getDocuments().forEach(doc -> {
                            doc.setLesson(lesson);
                            lesson.getDocuments().add(doc);
                        });
                    }
                    
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return lessonRepository.findById(id)
                .filter(lesson -> lesson.getCours().getFormateur().getEmail().equals(email))
                .map(lesson -> {
                    lessonRepository.delete(lesson);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @GetMapping("/students")
    public ResponseEntity<List<Enrollment>> getMyStudents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(enrollmentRepository.findByCoursFormateurEmail(email));
    }

    // --- Gestion des Quiz (QSM) ---

    @GetMapping("/lessons/{lessonId}/quiz")
    public ResponseEntity<?> getLessonQuiz(@PathVariable Long lessonId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return lessonRepository.findById(lessonId)
                .filter(lesson -> lesson.getCours().getFormateur().getEmail().equals(email))
                .map(lesson -> {
                    Quiz quiz = quizRepository.findByLessonId(lessonId).orElse(null);
                    return ResponseEntity.ok(quiz);
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @PostMapping("/lessons/{lessonId}/quiz")
    public ResponseEntity<?> saveQuiz(@PathVariable Long lessonId, @RequestBody Quiz quizRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return lessonRepository.findById(lessonId)
                .filter(lesson -> lesson.getCours().getFormateur().getEmail().equals(email))
                .map(lesson -> {
                    Quiz quiz = quizRepository.findByLessonId(lessonId)
                            .orElse(Quiz.builder().lesson(lesson).build());
                    
                    quiz.setTitre(quizRequest.getTitre());
                    quiz.setDureeMinutes(quizRequest.getDureeMinutes());
                    quiz.setScoreMinimum(quizRequest.getScoreMinimum());
                    
                    Quiz savedQuiz = quizRepository.save(quiz);
                    
                    // Remove old questions and add new ones
                    if (quiz.getQuestions() != null) {
                        questionRepository.deleteAll(quiz.getQuestions());
                    }
                    
                    if (quizRequest.getQuestions() != null) {
                        quizRequest.getQuestions().forEach(q -> {
                            q.setQuiz(savedQuiz);
                            questionRepository.save(q);
                        });
                    }
                    
                    return ResponseEntity.ok(quizRepository.findById(savedQuiz.getId()).orElse(savedQuiz));
                })
                .orElse(ResponseEntity.status(403).build());
    }
}

