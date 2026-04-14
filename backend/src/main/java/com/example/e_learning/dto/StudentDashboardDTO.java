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
public class StudentDashboardDTO {
    private long enrolledCoursesCount;
    private long completedCoursesCount;
    private int averageAttendance; // Percentage of completed lessons across all enrolled courses
    private List<CourseProgressDTO> recentCourses;
}
