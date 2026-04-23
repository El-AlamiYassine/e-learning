package com.example.e_learning.repository;

import com.example.e_learning.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCoursId(Long courseId);
    
    @Query("SELECT AVG(c.note) FROM Comment c WHERE c.cours.formateur.email = :email")
    Double getAverageRatingByTeacherEmail(String email);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.cours.formateur.email = :email")
    long countByTeacherEmail(String email);
}
