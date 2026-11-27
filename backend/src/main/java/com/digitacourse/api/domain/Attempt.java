package com.digitacourse.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "attempts")
@Getter
@Setter
@NoArgsConstructor
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "lesson_id", nullable = false, length = 50)
    private String lessonId;

    @Column(nullable = false)
    private int wpm;

    @Column(nullable = false, precision = 4, scale = 1)
    private BigDecimal accuracy;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(nullable = false)
    private int characters;

    @Column(nullable = false)
    private int errors;

    @Column(nullable = false)
    private int xp;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
