package com.digitacourse.api.repository;

import com.digitacourse.api.domain.Course;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, String> {

    List<Course> findAllByOrderBySortOrderAsc();
}
