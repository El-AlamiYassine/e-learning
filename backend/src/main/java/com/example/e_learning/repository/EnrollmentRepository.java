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
}
