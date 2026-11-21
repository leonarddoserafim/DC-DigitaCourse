package com.digitacourse.api.web.dto;

public record ProfileUpdateRequest(
        String name,
        Integer dailyGoalMinutes,
        Boolean publicProfile,
        Boolean emailReminders,
        Boolean weeklySummary) {
}
