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
    }
}
