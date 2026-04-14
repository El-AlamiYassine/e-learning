package com.example.e_learning.repository;

import com.example.e_learning.model.Course;
import com.example.e_learning.model.StatutCours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStatut(StatutCours statut);
    List<Course> findByFormateurEmail(String email);
    List<Course> findByStatutAndCategorieId(StatutCours statut, Long categoryId);
    long countByFormateurEmail(String email);
}
