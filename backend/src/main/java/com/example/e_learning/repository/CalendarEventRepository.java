package com.example.e_learning.repository;

import com.example.e_learning.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    @Query("SELECT e FROM CalendarEvent e WHERE e.course IS NULL OR e.course.id IN :courseIds")
    List<CalendarEvent> findGlobalAndByCourseIds(@Param("courseIds") List<Long> courseIds);
    
    List<CalendarEvent> findByCourseIsNull();
}
