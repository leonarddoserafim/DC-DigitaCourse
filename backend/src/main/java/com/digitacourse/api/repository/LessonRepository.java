package com.digitacourse.api.repository;

import com.digitacourse.api.domain.Lesson;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, String> {

    List<Lesson> findAllByOrderBySortOrderAsc();

    List<Lesson> findByModuleIdOrderBySortOrderAsc(String moduleId);
}
