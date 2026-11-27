package com.digitacourse.api.repository;

import com.digitacourse.api.domain.CourseModule;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseModuleRepository extends JpaRepository<CourseModule, String> {

    List<CourseModule> findAllByOrderBySortOrderAsc();

    List<CourseModule> findByCourseIdOrderBySortOrderAsc(String courseId);
}
