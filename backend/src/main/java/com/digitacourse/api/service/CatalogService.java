package com.digitacourse.api.service;

import com.digitacourse.api.domain.Course;
import com.digitacourse.api.domain.CourseModule;
import com.digitacourse.api.domain.Lesson;
import com.digitacourse.api.repository.CourseModuleRepository;
import com.digitacourse.api.repository.CourseRepository;
import com.digitacourse.api.repository.LessonRepository;
import com.digitacourse.api.web.dto.CourseView;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    public CatalogService(
            CourseRepository courseRepository,
            CourseModuleRepository moduleRepository,
            LessonRepository lessonRepository) {
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
    }

    public List<CourseView> getCatalog() {
        List<Course> courses = courseRepository.findAllByOrderBySortOrderAsc();
        List<CourseModule> modules = moduleRepository.findAllByOrderBySortOrderAsc();
        List<Lesson> lessons = lessonRepository.findAllByOrderBySortOrderAsc();

        Map<String, List<Lesson>> lessonsByModule = lessons.stream()
                .collect(Collectors.groupingBy(Lesson::getModuleId, LinkedHashMap::new, Collectors.toList()));
        Map<String, List<CourseModule>> modulesByCourse = modules.stream()
                .collect(Collectors.groupingBy(CourseModule::getCourseId, LinkedHashMap::new, Collectors.toList()));

        return courses.stream()
                .map(course -> new CourseView(
                        course.getId(),
                        course.getTitle(),
                        course.getShortTitle(),
                        course.getDescription(),
                        course.getLevel(),
                        course.getTone(),
                        course.getDuration(),
                        course.getFocus(),
                        modulesByCourse.getOrDefault(course.getId(), List.of()).stream()
                                .map(module -> new CourseView.ModuleView(
                                        module.getId(),
                                        module.getTitle(),
                                        lessonsByModule.getOrDefault(module.getId(), List.of()).stream()
                                                .map(this::toLessonView)
                                                .toList()))
                                .toList()))
                .toList();
    }

    public Optional<LessonContext> findLesson(String lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) {
            return Optional.empty();
        }
        CourseModule module = moduleRepository.findById(lesson.getModuleId()).orElse(null);
        if (module == null) {
            return Optional.empty();
        }
        Course course = courseRepository.findById(module.getCourseId()).orElse(null);
        if (course == null) {
            return Optional.empty();
        }
        return Optional.of(new LessonContext(lesson, module, course));
    }

    public List<LessonContext> lessonsForCourse(String courseId) {
        List<CourseModule> modules = moduleRepository.findByCourseIdOrderBySortOrderAsc(courseId);
        return modules.stream()
                .flatMap(module -> lessonRepository.findByModuleIdOrderBySortOrderAsc(module.getId()).stream()
                        .map(lesson -> new LessonContext(
                                lesson,
                                module,
                                courseRepository.findById(courseId).orElseThrow())))
                .toList();
    }

    public Map<String, LessonContext> lessonContexts() {
        List<Course> courses = courseRepository.findAllByOrderBySortOrderAsc();
        Map<String, Course> coursesById = courses.stream()
                .collect(Collectors.toMap(Course::getId, Function.identity()));
        Map<String, CourseModule> modulesById = moduleRepository.findAllByOrderBySortOrderAsc().stream()
                .collect(Collectors.toMap(CourseModule::getId, Function.identity()));

        Map<String, LessonContext> result = new LinkedHashMap<>();
        for (Lesson lesson : lessonRepository.findAllByOrderBySortOrderAsc()) {
            CourseModule module = modulesById.get(lesson.getModuleId());
            if (module == null) {
                continue;
            }
            Course course = coursesById.get(module.getCourseId());
            if (course == null) {
                continue;
            }
            result.put(lesson.getId(), new LessonContext(lesson, module, course));
        }
        return result;
    }

    private CourseView.LessonView toLessonView(Lesson lesson) {
        return new CourseView.LessonView(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getDuration(),
                lesson.getXp(),
                lesson.getFocus(),
                lesson.getText());
    }

    public record LessonContext(Lesson lesson, CourseModule module, Course course) {
    }
}
