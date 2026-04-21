package com.example.e_learning.repository;

import com.example.e_learning.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByEtudiantEmailAndCoursId(String email, Long courseId);
    List<Certificate> findByEtudiantEmailOrderByDateEmissionDesc(String email);
}
