package com.digitacourse.api.service;

import com.digitacourse.api.domain.Attempt;
import com.digitacourse.api.domain.CompletedLesson;
import com.digitacourse.api.domain.Notification;
import com.digitacourse.api.domain.UserAccount;
import com.digitacourse.api.domain.UserPreferences;
import com.digitacourse.api.repository.AttemptRepository;
import com.digitacourse.api.repository.CompletedLessonRepository;
import com.digitacourse.api.repository.NotificationRepository;
import com.digitacourse.api.repository.UserPreferencesRepository;
import com.digitacourse.api.repository.UserRepository;
import com.digitacourse.api.web.ApiException;
import com.digitacourse.api.web.dto.AccountView;
import com.digitacourse.api.web.dto.AttemptRequest;
import com.digitacourse.api.web.dto.ProfileUpdateRequest;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountService {

    private static final Set<Integer> ALLOWED_DAILY_GOALS = Set.of(5, 10, 15, 20);
    private static final int MAX_NOTIFICATIONS = 30;

    private final UserRepository userRepository;
    private final UserPreferencesRepository preferencesRepository;
    private final AttemptRepository attemptRepository;
    private final CompletedLessonRepository completedLessonRepository;
    private final NotificationRepository notificationRepository;
    private final CatalogService catalogService;

    public AccountService(
            UserRepository userRepository,
            UserPreferencesRepository preferencesRepository,
            AttemptRepository attemptRepository,
            CompletedLessonRepository completedLessonRepository,
            NotificationRepository notificationRepository,
            CatalogService catalogService) {
        this.userRepository = userRepository;
        this.preferencesRepository = preferencesRepository;
        this.attemptRepository = attemptRepository;
        this.completedLessonRepository = completedLessonRepository;
        this.notificationRepository = notificationRepository;
        this.catalogService = catalogService;
    }

    @Transactional(readOnly = true)
    public AccountView getAccount(UUID userId) {
        UserAccount user = requireUser(userId);
        UserPreferences preferences = preferencesRepository.findById(userId)
                .orElseGet(() -> defaultPreferences(userId));
        Map<String, CatalogService.LessonContext> lessons = catalogService.lessonContexts();

        List<String> completedLessons = completedLessonRepository.findByUserIdOrderByCompletedAtAsc(userId)
                .stream()
                .map(CompletedLesson::getLessonId)
                .toList();

        List<AccountView.AttemptView> attempts = attemptRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(attempt -> toAttemptView(attempt, lessons))
                .toList();

        List<AccountView.NotificationView> notifications =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                        .stream()
                        .map(this::toNotificationView)
                        .toList();

        return new AccountView(
                new AccountView.UserView(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getJoinedAt()),
                new AccountView.PreferencesView(
                        preferences.getDailyGoalMinutes(),
                        preferences.isPublicProfile(),
                        preferences.isEmailReminders(),
                        preferences.isWeeklySummary()),
                completedLessons,
                attempts,
                notifications);
    }

    @Transactional
    public AccountView updateProfile(UUID userId, ProfileUpdateRequest request) {
        UserAccount user = requireUser(userId);
        UserPreferences preferences = preferencesRepository.findById(userId)
                .orElseGet(() -> defaultPreferences(userId));

        if (request.name() != null) {
            String name = request.name().trim();
            if (name.length() < 2 || name.length() > 120) {
                throw ApiException.badRequest("Informe um nome com pelo menos 2 caracteres.");
            }
            user.setName(name);
            userRepository.save(user);
        }

        if (request.dailyGoalMinutes() != null) {
            if (!ALLOWED_DAILY_GOALS.contains(request.dailyGoalMinutes())) {
                throw ApiException.badRequest("Escolha uma meta diária válida.");
            }
            preferences.setDailyGoalMinutes(request.dailyGoalMinutes());
        }
        if (request.publicProfile() != null) {
            preferences.setPublicProfile(request.publicProfile());
        }
        if (request.emailReminders() != null) {
            preferences.setEmailReminders(request.emailReminders());
        }
        if (request.weeklySummary() != null) {
            preferences.setWeeklySummary(request.weeklySummary());
        }
        preferencesRepository.save(preferences);

        return getAccount(userId);
    }

    @Transactional
    public AccountView resetProgress(UUID userId) {
        requireUser(userId);
        attemptRepository.deleteByUserId(userId);
        completedLessonRepository.deleteByUserId(userId);

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle("Progresso redefinido");
        notification.setMessage("Seu histórico de prática foi zerado. Você pode começar de novo.");
        notification.setKind("goal");
        notification.setHref("/app/trilhas");
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        notificationRepository.save(notification);
        trimNotifications(userId);

        return getAccount(userId);
    }

    @Transactional
    public AccountView markNotificationRead(UUID userId, UUID notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> ApiException.notFound("Notificação não encontrada."));
        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return getAccount(userId);
    }

    @Transactional
    public AccountView markAllNotificationsRead(UUID userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(userId);
        unread.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unread);
        return getAccount(userId);
    }

    @Transactional
    public AccountView recordAttempt(UUID userId, String lessonId, AttemptRequest request) {
        requireUser(userId);
        CatalogService.LessonContext context = catalogService.findLesson(lessonId)
                .orElseThrow(() -> ApiException.notFound("Lição não encontrada."));

        validateUnlocked(userId, context);

        double accuracyValue = Math.max(0, Math.min(100, request.accuracy()));
        BigDecimal accuracy = BigDecimal.valueOf(accuracyValue).setScale(1, RoundingMode.HALF_UP);
        boolean newCompletion = !completedLessonRepository.existsByUserIdAndLessonId(userId, lessonId);
        int bonus = accuracyValue >= 98 ? 10 : 0;
        int xp = context.lesson().getXp() + bonus;

        Attempt attempt = new Attempt();
        attempt.setUserId(userId);
        attempt.setLessonId(lessonId);
        attempt.setWpm(Math.max(0, Math.min(400, request.wpm())));
        attempt.setAccuracy(accuracy);
        attempt.setDurationSeconds(Math.max(1, request.durationSeconds()));
        attempt.setCharacters(context.lesson().getText().length());
        attempt.setErrors(Math.max(0, request.errors()));
        attempt.setXp(xp);
        attempt.setCreatedAt(Instant.now());
        attemptRepository.save(attempt);

        if (newCompletion) {
            CompletedLesson completed = new CompletedLesson();
            completed.setUserId(userId);
            completed.setLessonId(lessonId);
            completed.setCompletedAt(Instant.now());
            completedLessonRepository.save(completed);
        }

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(newCompletion ? "Lição concluída" : "Prática registrada");
        notification.setMessage(String.format(
                Locale.forLanguageTag("pt-BR"),
                "%s: %d WPM, %s%% de precisão e +%d XP.",
                context.lesson().getTitle(),
                attempt.getWpm(),
                accuracy.toPlainString().replace('.', ','),
                xp));
        notification.setKind("lesson");
        notification.setHref("/app/progresso");
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        notificationRepository.save(notification);
        trimNotifications(userId);

        return getAccount(userId);
    }

    private void validateUnlocked(UUID userId, CatalogService.LessonContext context) {
        List<CatalogService.LessonContext> courseLessons =
                catalogService.lessonsForCourse(context.course().getId());
        int index = -1;
        for (int i = 0; i < courseLessons.size(); i++) {
            if (courseLessons.get(i).lesson().getId().equals(context.lesson().getId())) {
                index = i;
                break;
            }
        }
        if (index > 0) {
            String previousLessonId = courseLessons.get(index - 1).lesson().getId();
            if (!completedLessonRepository.existsByUserIdAndLessonId(userId, previousLessonId)) {
                throw ApiException.conflict("Conclua a lição anterior para liberar este exercício.");
            }
        }
    }

    public UserPreferences defaultPreferences(UUID userId) {
        UserPreferences preferences = new UserPreferences();
        preferences.setUserId(userId);
        preferences.setDailyGoalMinutes(10);
        preferences.setPublicProfile(true);
        preferences.setEmailReminders(true);
        preferences.setWeeklySummary(true);
        return preferences;
    }

    private UserAccount requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("Sessão expirada. Entre novamente."));
    }

    private AccountView.AttemptView toAttemptView(
            Attempt attempt,
            Map<String, CatalogService.LessonContext> lessons) {
        CatalogService.LessonContext context = lessons.get(attempt.getLessonId());
        return new AccountView.AttemptView(
                attempt.getId(),
                attempt.getLessonId(),
                context != null ? context.lesson().getTitle() : "Lição",
                context != null ? context.course().getId() : "",
                context != null ? context.course().getTitle() : "",
                attempt.getWpm(),
                attempt.getAccuracy(),
                attempt.getDurationSeconds(),
                attempt.getCharacters(),
                attempt.getErrors(),
                attempt.getXp(),
                attempt.getCreatedAt());
    }

    private AccountView.NotificationView toNotificationView(Notification notification) {
        return new AccountView.NotificationView(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getKind(),
                notification.getHref(),
                notification.isRead(),
                notification.getCreatedAt());
    }

    private void trimNotifications(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (notifications.size() > MAX_NOTIFICATIONS) {
            notificationRepository.deleteAll(notifications.subList(MAX_NOTIFICATIONS, notifications.size()));
        }
    }
}
