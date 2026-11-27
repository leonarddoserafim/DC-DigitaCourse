package com.digitacourse.api.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AccountView(
        UserView user,
        PreferencesView prefs,
        List<String> completedLessons,
        List<AttemptView> attempts,
        List<NotificationView> notifications) {

    public record UserView(UUID id, String name, String email, String role, Instant joinedAt) {
    }

    public record PreferencesView(
            int dailyGoalMinutes,
            boolean publicProfile,
            boolean emailReminders,
            boolean weeklySummary) {
    }

    public record AttemptView(
            UUID id,
            String lessonId,
            String lessonTitle,
            String courseId,
            String courseTitle,
            int wpm,
            BigDecimal accuracy,
            int durationSeconds,
            int characters,
            int errors,
            int xp,
            Instant createdAt) {
    }

    public record NotificationView(
            UUID id,
            String title,
            String message,
            String kind,
            String href,
            boolean read,
            Instant createdAt) {
    }
}
