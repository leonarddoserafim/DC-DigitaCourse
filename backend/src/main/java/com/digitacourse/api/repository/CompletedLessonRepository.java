package com.digitacourse.api.repository;

import com.digitacourse.api.domain.CompletedLesson;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompletedLessonRepository extends JpaRepository<CompletedLesson, UUID> {

    List<CompletedLesson> findByUserIdOrderByCompletedAtAsc(UUID userId);

    boolean existsByUserIdAndLessonId(UUID userId, String lessonId);

    void deleteByUserId(UUID userId);
}
