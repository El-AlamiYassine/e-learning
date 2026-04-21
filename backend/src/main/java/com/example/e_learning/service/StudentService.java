package com.example.e_learning.service;

import com.example.e_learning.dto.*;
import com.example.e_learning.model.*;
import com.example.e_learning.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final CertificateRepository certificateRepository;
    private final CalendarEventRepository calendarEventRepository;

    public StudentDashboardDTO getDashboardSummary(String email) {
        long enrolledCount = enrollmentRepository.countByEtudiantEmail(email);
        long completedEnrolledCount = enrollmentRepository.countByEtudiantEmailAndStatut(email, StatutInscription.TERMINE);
        
        List<Enrollment> recentEnrollments = enrollmentRepository.findByEtudiantEmail(email);
        
        List<CourseProgressDTO> recentCourses = recentEnrollments.stream()
                .limit(5)
                .map(this::mapToCourseProgressDTO)
                .collect(Collectors.toList());

        // Calculate average attendance (total completed lessons / total lessons across all courses)
        int totalLessons = recentEnrollments.stream()
                .mapToInt(e -> e.getCours().getLessons().size())
                .sum();
        
        long completedLessons = progressRepository.countByEtudiantEmailAndTermineTrue(email);
        
        int attendance = totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0;

        return StudentDashboardDTO.builder()
                .enrolledCoursesCount(enrolledCount)
                .completedCoursesCount(completedEnrolledCount)
                .averageAttendance(Math.min(attendance, 100))
                .recentCourses(recentCourses)
                .build();
    }

    public List<CourseProgressDTO> getEnrolledCourses(String email) {
        return enrollmentRepository.findByEtudiantEmail(email).stream()
                .map(this::mapToCourseProgressDTO)
                .collect(Collectors.toList());
    }

    private CourseProgressDTO mapToCourseProgressDTO(Enrollment enrollment) {
        String email = enrollment.getEtudiant().getEmail();
        Long courseId = enrollment.getCours().getId();
        
        List<Lesson> lessons = enrollment.getCours().getLessons();
        int totalLessons = lessons.size();
        long completedLessons = progressRepository.countByEtudiantEmailAndLessonCoursIdAndTermineTrue(email, courseId);
        
        int percentage = totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0;

        return CourseProgressDTO.builder()
                .id(courseId)
                .title(enrollment.getCours().getTitre())
                .instructorName(enrollment.getCours().getFormateur().getPrenom() + " " + enrollment.getCours().getFormateur().getNom())
                .imageUrl(enrollment.getCours().getImageUrl())
                .progressPercentage(percentage)
                .completedLessons((int) completedLessons)
                .totalLessons(totalLessons)
                .build();
    }
    public List<Course> getAvailableCourses(Long categoryId) {
        if (categoryId != null && categoryId > 0) {
            return courseRepository.findByStatutAndCategorieId(StatutCours.PUBLIE, categoryId);
        }
        return courseRepository.findByStatut(StatutCours.PUBLIE);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public void enroll(Long courseId, String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        if (enrollmentRepository.findByEtudiantEmail(email).stream()
                .anyMatch(e -> e.getCours().getId().equals(courseId))) {
            throw new RuntimeException("Vous êtes déjà inscrit à ce cours");
        }

        Enrollment enrollment = Enrollment.builder()
                .etudiant(student)
                .cours(course)
                .statut(StatutInscription.ACTIVE)
                .dateInscription(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);
    }

    public CourseDetailDTO getCourseDetail(Long courseId, String email) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        
        List<Lesson> lessons = lessonRepository.findByCoursIdOrderByOrdreAsc(courseId);
        List<Long> completedLessonIds = progressRepository.findByEtudiantEmailAndLessonCoursIdAndTermineTrue(email, courseId)
                .stream()
                .map(p -> p.getLesson().getId())
                .collect(Collectors.toList());

        List<CourseDetailDTO.LessonDetailDTO> lessonDTOs = lessons.stream()
                .map(l -> {
                    List<CourseDetailDTO.DocumentDTO> docDTOs = null;
                    if (l.getDocuments() != null) {
                        docDTOs = l.getDocuments().stream().map(d -> 
                            CourseDetailDTO.DocumentDTO.builder()
                                .id(d.getId())
                                .nom(d.getNom())
                                .cheminFichier(d.getCheminFichier())
                                .type(d.getType())
                                .build()
                        ).collect(Collectors.toList());
                    }

                    return CourseDetailDTO.LessonDetailDTO.builder()
                        .id(l.getId())
                        .title(l.getTitre())
                        .content(l.getContenu())
                        .videoUrl(l.getVideoUrl())
                        .ordre(l.getOrdre())
                        .completed(completedLessonIds.contains(l.getId()))
                        .hasQuiz(l.getQuiz() != null)
                        .quizId(l.getQuiz() != null ? l.getQuiz().getId() : null)
                        .documents(docDTOs)
                        .build();
                })
                .collect(Collectors.toList());

        int progress = lessons.size() > 0 ? (completedLessonIds.size() * 100) / lessons.size() : 0;

        return CourseDetailDTO.builder()
                .id(course.getId())
                .title(course.getTitre())
                .description(course.getDescription())
                .instructorName(course.getFormateur().getPrenom() + " " + course.getFormateur().getNom())
                .imageUrl(course.getImageUrl())
                .lessons(lessonDTOs)
                .progressPercentage(progress)
                .build();
    }

    public CourseDetailDTO.LessonDetailDTO getLessonDetail(Long lessonId, String email) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));

        // Verify student is enrolled in the course
        Long courseId = lesson.getCours().getId();
        boolean enrolled = enrollmentRepository.findByEtudiantEmail(email).stream()
                .anyMatch(e -> e.getCours().getId().equals(courseId));
        if (!enrolled) {
            throw new RuntimeException("Vous n'êtes pas inscrit à ce cours");
        }

        boolean completed = progressRepository.findByEtudiantEmailAndLessonId(email, lessonId)
                .map(p -> p.getTermine())
                .orElse(false);

        List<CourseDetailDTO.DocumentDTO> docDTOs = null;
        if (lesson.getDocuments() != null) {
            docDTOs = lesson.getDocuments().stream().map(d ->
                CourseDetailDTO.DocumentDTO.builder()
                    .id(d.getId())
                    .nom(d.getNom())
                    .cheminFichier(d.getCheminFichier())
                    .type(d.getType())
                    .build()
            ).collect(Collectors.toList());
        }

        return CourseDetailDTO.LessonDetailDTO.builder()
                .id(lesson.getId())
                .title(lesson.getTitre())
                .content(lesson.getContenu())
                .videoUrl(lesson.getVideoUrl())
                .ordre(lesson.getOrdre())
                .completed(completed)
                .hasQuiz(lesson.getQuiz() != null)
                .quizId(lesson.getQuiz() != null ? lesson.getQuiz().getId() : null)
                .documents(docDTOs)
                .build();
    }

    public CourseDetailDTO.QuizDTO getQuiz(Long lessonId, String email) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé pour cette leçon"));

        List<CourseDetailDTO.QuestionDTO> questionDTOs = quiz.getQuestions().stream()
                .map(q -> CourseDetailDTO.QuestionDTO.builder()
                        .id(q.getId())
                        .enonce(q.getEnonce())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        // Don't send the correct answer yet
                        .build())
                .collect(Collectors.toList());

        return CourseDetailDTO.QuizDTO.builder()
                .id(quiz.getId())
                .titre(quiz.getTitre())
                .dureeMinutes(quiz.getDureeMinutes())
                .scoreMinimum(quiz.getScoreMinimum())
                .questions(questionDTOs)
                .build();
    }

    @Transactional
    public Map<String, Object> submitQuiz(Long lessonId, Map<Long, String> answers, String email) {
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé"));

        List<Question> questions = quiz.getQuestions();
        int totalQuestions = questions.size();
        int correctCount = 0;

        for (Question q : questions) {
            String studentAnswer = answers.get(q.getId());
            if (studentAnswer != null && studentAnswer.equalsIgnoreCase(q.getReponseCorrecte())) {
                correctCount++;
            }
        }

        int score = totalQuestions > 0 ? (correctCount * 100) / totalQuestions : 0;
        boolean passed = score >= quiz.getScoreMinimum();

        if (passed) {
            completeLesson(lessonId, email);
        }

        return Map.of(
            "score", score,
            "correctCount", correctCount,
            "totalQuestions", totalQuestions,
            "passed", passed,
            "scoreMinimum", quiz.getScoreMinimum()
        );
    }

    public CourseDetailDTO getCourseDetailByLessonId(Long lessonId, String email) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        return getCourseDetail(lesson.getCours().getId(), email);
    }

    @Transactional
    public void completeLesson(Long lessonId, String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));

        Progress progress = progressRepository.findByEtudiantEmailAndLessonId(email, lessonId)
                .orElse(Progress.builder()
                        .etudiant(student)
                        .lesson(lesson)
                        .build());

        progress.setTermine(true);
        progress.setDateMaj(LocalDateTime.now());
        progressRepository.save(progress);
    }

    @Transactional
    public CertificateDTO getOrCreateCertificate(Long courseId, String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        // Check completion
        List<Lesson> lessons = lessonRepository.findByCoursIdOrderByOrdreAsc(courseId);
        long completedCount = progressRepository.countByEtudiantEmailAndLessonCoursIdAndTermineTrue(email, courseId);
        
        if (lessons.isEmpty() || completedCount < lessons.size()) {
            throw new RuntimeException("Le cours n'est pas encore terminé à 100%");
        }

        Certificate certificate = certificateRepository.findByEtudiantEmailAndCoursId(email, courseId)
                .orElseGet(() -> {
                    Certificate newCert = Certificate.builder()
                            .etudiant(student)
                            .cours(course)
                            .dateEmission(LocalDateTime.now())
                            .codeVerification(java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                            .build();
                    return certificateRepository.save(newCert);
                });

        return CertificateDTO.builder()
                .id(certificate.getId())
                .studentName(student.getPrenom() + " " + student.getNom())
                .courseTitle(course.getTitre())
                .issueDate(certificate.getDateEmission())
                .verificationCode(certificate.getCodeVerification())
                .build();
    }

    public List<CertificateDTO> getStudentCertificates(String email) {
        return certificateRepository.findByEtudiantEmailOrderByDateEmissionDesc(email).stream()
                .map(cert -> CertificateDTO.builder()
                        .id(cert.getId())
                        .studentName(cert.getEtudiant().getPrenom() + " " + cert.getEtudiant().getNom())
                        .courseTitle(cert.getCours().getTitre())
                        .issueDate(cert.getDateEmission())
                        .verificationCode(cert.getCodeVerification())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CalendarEventDTO> getStudentCalendarEvents(String email) {
        List<Long> enrolledCourseIds = enrollmentRepository.findByEtudiantEmail(email).stream()
                .map(e -> e.getCours().getId())
                .collect(Collectors.toList());

        List<CalendarEvent> events;
        if (enrolledCourseIds.isEmpty()) {
            events = calendarEventRepository.findByCourseIsNull();
        } else {
            events = calendarEventRepository.findGlobalAndByCourseIds(enrolledCourseIds);
        }

        return events.stream()
                .map(e -> CalendarEventDTO.builder()
                        .id(e.getId())
                        .title(e.getTitle())
                        .description(e.getDescription())
                        .eventDate(e.getEventDate())
                        .type(e.getType())
                        .courseTitle(e.getCourse() != null ? e.getCourse().getTitre() : "Global")
                        .build())
                .collect(Collectors.toList());
    }
}
