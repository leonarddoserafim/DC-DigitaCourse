package com.digitacourse.api.web.dto;

import java.util.List;

public record CourseView(
        String id,
        String title,
        String shortTitle,
        String description,
        String level,
        String tone,
        int duration,
        String focus,
        List<ModuleView> modules) {

    public record ModuleView(String id, String title, List<LessonView> lessons) {
    }

    public record LessonView(
            String id,
            String title,
            String description,
            int duration,
            int xp,
            String focus,
            String text) {
    }
}
