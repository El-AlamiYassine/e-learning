package com.example.e_learning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDTO {
    private Long id;
    private String title;
    private String instructorName;
    private String imageUrl;
    private int progressPercentage;
    private int completedLessons;
    private int totalLessons;
}
