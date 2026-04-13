package com.example.e_learning.repository;

import com.example.e_learning.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByCoursFormateurEmail(String email);
    long countByCoursFormateurEmail(String email);
}
