package com.example.e_learning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String instructorName;
    private String imageUrl;
    private List<LessonDetailDTO> lessons;
    private int progressPercentage;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonDetailDTO {
        private Long id;
        private String title;
        private String content; // preview or summary
        private String videoUrl;
        private int ordre;
        private boolean completed;
        private boolean hasQuiz;
        private Long quizId;
        private List<DocumentDTO> documents;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocumentDTO {
        private Long id;
        private String nom;
        private String cheminFichier;
        private String type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizDTO {
        private Long id;
        private String titre;
        private int dureeMinutes;
        private int scoreMinimum;
        private List<QuestionDTO> questions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDTO {
        private Long id;
        private String enonce;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String reponseCorrecte; // Only populated for teachers or after submission
    }
}
