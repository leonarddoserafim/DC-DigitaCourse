package com.digitacourse.api.service;

import com.digitacourse.api.domain.Attempt;
import com.digitacourse.api.domain.CompletedLesson;
import com.digitacourse.api.domain.Notification;
import com.digitacourse.api.domain.UserAccount;
import com.digitacourse.api.domain.UserPreferences;
import com.digitacourse.api.repository.AttemptRepository;
import com.digitacourse.api.repository.CompletedLessonRepository;
import com.digitacourse.api.repository.LessonRepository;
import com.digitacourse.api.repository.NotificationRepository;
import com.digitacourse.api.repository.UserPreferencesRepository;
import com.digitacourse.api.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemoDataService {

    public static final String DEMO_EMAIL = "marina@digitacourse.com";
    public static final String DEMO_PASSWORD = "demo1234";

    private static final List<AttemptSeed> ATTEMPT_SEEDS = List.of(
            new AttemptSeed("dia-02", 0, 68, 98.6, 340, 3),
            new AttemptSeed("fund-04", 0, 65, 97.9, 190, 2),
            new AttemptSeed("dia-01", 0, 66, 98.1, 260, 1),
            new AttemptSeed("dia-02", 1, 66, 98.2, 320, null),
            new AttemptSeed("fund-03", 1, 61, 97.4, 240, null),
            new AttemptSeed("dia-01", 2, 63, 97.8, 280, null),
            new AttemptSeed("fund-04", 3, 62, 98.0, 200, null),
            new AttemptSeed("fund-03", 4, 60, 96.9, 230, null),
            new AttemptSeed("dia-02", 5, 59, 97.1, 300, null),
            new AttemptSeed("fund-02", 6, 57, 96.5, 160, null),
            new AttemptSeed("fund-01", 7, 54, 95.8, 140, null),
            new AttemptSeed("fund-03", 8, 56, 96.2, 220, null),
            new AttemptSeed("fund-02", 9, 53, 95.4, 150, null),
            new AttemptSeed("fund-01", 10, 51, 94.9, 130, null),
            new AttemptSeed("dia-01", 11, 58, 96.8, 260, null),
            new AttemptSeed("fund-04", 12, 55, 96.1, 190, null),
            new AttemptSeed("fund-01", 14, 48, 94.2, 120, null),
            new AttemptSeed("fund-02", 17, 50, 94.8, 140, null),
            new AttemptSeed("fund-03", 20, 52, 95.3, 210, null),
            new AttemptSeed("fund-01", 24, 47, 93.8, 130, null),
            new AttemptSeed("fund-02", 28, 49, 94.1, 145, null));

    private static final List<String> COMPLETED_LESSONS = List.of(
            "fund-01", "fund-02", "fund-03", "fund-04", "dia-01", "dia-02");

    private final UserRepository userRepository;
    private final UserPreferencesRepository preferencesRepository;
    private final AttemptRepository attemptRepository;
    private final CompletedLessonRepository completedLessonRepository;
    private final NotificationRepository notificationRepository;
    private final LessonRepository lessonRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataService(
            UserRepository userRepository,
            UserPreferencesRepository preferencesRepository,
            AttemptRepository attemptRepository,
            CompletedLessonRepository completedLessonRepository,
            NotificationRepository notificationRepository,
            LessonRepository lessonRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.preferencesRepository = preferencesRepository;
        this.attemptRepository = attemptRepository;
        this.completedLessonRepository = completedLessonRepository;
        this.notificationRepository = notificationRepository;
        this.lessonRepository = lessonRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserAccount ensureDemoAccount() {
        UserAccount existing = userRepository.findByEmailIgnoreCase(DEMO_EMAIL).orElse(null);
        if (existing != null) {
            ensurePreferences(existing.getId());
            return existing;
        }

        UserAccount demo = new UserAccount();
        demo.setName("Marina Costa");
        demo.setEmail(DEMO_EMAIL);
        demo.setPasswordHash(passwordEncoder.encode(DEMO_PASSWORD));
        demo.setRole("Aluno");
        demo.setJoinedAt(Instant.now().minus(64, ChronoUnit.DAYS));
        userRepository.save(demo);
        ensurePreferences(demo.getId());
        seedActivity(demo.getId());
        return demo;
    }

    @Transactional
    public UserAccount restoreDemoAccount() {
        UserAccount demo = ensureDemoAccount();
        attemptRepository.deleteByUserId(demo.getId());
        attemptRepository.flush();
        completedLessonRepository.deleteByUserId(demo.getId());
        completedLessonRepository.flush();
        notificationRepository.deleteByUserId(demo.getId());
        notificationRepository.flush();

        demo.setName("Marina Costa");
        demo.setRole("Aluno");
        demo.setJoinedAt(Instant.now().minus(64, ChronoUnit.DAYS));
        userRepository.save(demo);

        UserPreferences preferences = ensurePreferences(demo.getId());
        preferences.setDailyGoalMinutes(10);
        preferences.setPublicProfile(true);
        preferences.setEmailReminders(true);
        preferences.setWeeklySummary(true);
        preferencesRepository.save(preferences);

        seedActivity(demo.getId());
        return demo;
    }

    private UserPreferences ensurePreferences(UUID userId) {
        return preferencesRepository.findById(userId).orElseGet(() -> {
            UserPreferences preferences = new UserPreferences();
            preferences.setUserId(userId);
            preferences.setDailyGoalMinutes(10);
            preferences.setPublicProfile(true);
            preferences.setEmailReminders(true);
            preferences.setWeeklySummary(true);
            return preferencesRepository.save(preferences);
        });
    }

    private void seedActivity(UUID userId) {
        Instant now = Instant.now();
        ZoneId zone = ZoneId.systemDefault();

        for (int index = 0; index < ATTEMPT_SEEDS.size(); index++) {
            AttemptSeed seed = ATTEMPT_SEEDS.get(index);
            var lesson = lessonRepository.findById(seed.lessonId()).orElse(null);
            if (lesson == null) {
                continue;
            }

            Instant createdAt;
            if (seed.daysAgo() == 0 && seed.hoursAgo() != null) {
                createdAt = now.minus(seed.hoursAgo(), ChronoUnit.HOURS);
            } else {
                createdAt = ZonedDateTime.ofInstant(now, zone)
                        .minusDays(seed.daysAgo())
                        .withHour(18)
                        .withMinute(10 + (index % 40))
                        .withSecond(0)
                        .withNano(0)
                        .toInstant();
            }

            int bonus = seed.accuracy() >= 98 ? 10 : 0;
            int characters = lesson.getText().length();
            int errors = Math.max(0, (int) Math.round(characters * (1 - seed.accuracy() / 100)));

            Attempt attempt = new Attempt();
            attempt.setUserId(userId);
            attempt.setLessonId(seed.lessonId());
            attempt.setWpm(seed.wpm());
            attempt.setAccuracy(BigDecimal.valueOf(seed.accuracy()).setScale(1, RoundingMode.HALF_UP));
            attempt.setDurationSeconds(seed.duration());
            attempt.setCharacters(characters);
            attempt.setErrors(errors);
            attempt.setXp(lesson.getXp() + bonus);
            attempt.setCreatedAt(createdAt);
            attemptRepository.save(attempt);
        }

        for (int index = 0; index < COMPLETED_LESSONS.size(); index++) {
            if (!lessonRepository.existsById(COMPLETED_LESSONS.get(index))) {
                continue;
            }
            CompletedLesson completed = new CompletedLesson();
            completed.setUserId(userId);
            completed.setLessonId(COMPLETED_LESSONS.get(index));
            completed.setCompletedAt(now.minus(30L - index, ChronoUnit.DAYS));
            completedLessonRepository.save(completed);
        }

        saveNotification(userId, "Meta diária concluída",
                "Você já praticou 13 minutos hoje. Continue assim!",
                "goal", "/app/progresso", false, now.minus(2, ChronoUnit.HOURS));
        saveNotification(userId, "Nova conquista: Precisão de ouro",
                "Você alcançou 98,6% de precisão em um exercício.",
                "achievement", "/app/conquistas", false, now.minus(26, ChronoUnit.HOURS));
        saveNotification(userId, "Sua sequência chegou a 13 dias",
                "A constância está virando hábito. Que tal praticar mais um pouco?",
                "streak", "/app/progresso", true, now.minus(30, ChronoUnit.HOURS));
        saveNotification(userId, "Trilha liberada: Textos com fluência",
                "Você já tem acesso à primeira lição da trilha avançada.",
                "course", "/app/trilhas/fluencia", true, now.minus(3, ChronoUnit.DAYS));
    }

    private void saveNotification(
            UUID userId,
            String title,
            String message,
            String kind,
            String href,
            boolean read,
            Instant createdAt) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setKind(kind);
        notification.setHref(href);
        notification.setRead(read);
        notification.setCreatedAt(createdAt);
        notificationRepository.save(notification);
    }

    private record AttemptSeed(
            String lessonId,
            int daysAgo,
            int wpm,
            double accuracy,
            int duration,
            Integer hoursAgo) {
    }
}
