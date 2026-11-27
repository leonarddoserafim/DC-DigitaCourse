package com.digitacourse.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserPreferences {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "daily_goal_minutes", nullable = false)
    private int dailyGoalMinutes = 10;

    @Column(name = "public_profile", nullable = false)
    private boolean publicProfile = true;

    @Column(name = "email_reminders", nullable = false)
    private boolean emailReminders = true;

    @Column(name = "weekly_summary", nullable = false)
    private boolean weeklySummary = true;
}
