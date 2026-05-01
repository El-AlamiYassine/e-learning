package com.example.e_learning.repository;

import com.example.e_learning.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByCoursFormateurEmail(String email);
    long countByCoursFormateurEmail(String email);
    List<Enrollment> findByEtudiantEmail(String email);
    long countByEtudiantEmail(String email);
    long countByEtudiantEmailAndStatut(String email, com.example.e_learning.model.StatutInscription statut);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(e.cours.prix) FROM Enrollment e WHERE e.cours.formateur.email = :email")
    Double getTotalRevenueByTeacherEmail(String email);

    List<Enrollment> findByCoursFormateurEmailOrderByDateInscriptionAsc(String email);
    java.util.Optional<com.example.e_learning.model.Enrollment> findByEtudiantEmailAndCoursId(String email, Long courseId);
}
