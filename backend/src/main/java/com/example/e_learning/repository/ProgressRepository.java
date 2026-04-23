package com.example.e_learning.repository;

import com.example.e_learning.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByEtudiantEmail(String email);
    List<Progress> findByEtudiantEmailAndLessonCoursId(String email, Long courseId);
    Optional<Progress> findByEtudiantEmailAndLessonId(String email, Long lessonId);
    long countByEtudiantEmailAndTermineTrue(String email);
    
    // To help calculate progress per course
    long countByEtudiantEmailAndLessonCoursIdAndTermineTrue(String email, Long courseId);
    List<Progress> findByEtudiantEmailAndLessonCoursIdAndTermineTrue(String email, Long courseId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM Progress p WHERE p.termine = true AND p.lesson.cours.formateur.email = :email")
    long countCompletedLessonsByTeacherEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(l) FROM Enrollment e JOIN e.cours.lessons l WHERE e.cours.formateur.email = :email")
    long countTotalPotentialLessonsByTeacherEmail(String email);
}
