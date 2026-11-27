package com.digitacourse.api.service;

import com.digitacourse.api.domain.Notification;
import com.digitacourse.api.domain.UserAccount;
import com.digitacourse.api.domain.UserPreferences;
import com.digitacourse.api.repository.NotificationRepository;
import com.digitacourse.api.repository.UserPreferencesRepository;
import com.digitacourse.api.repository.UserRepository;
import com.digitacourse.api.security.JwtService;
import com.digitacourse.api.web.ApiException;
import com.digitacourse.api.web.dto.AuthResponse;
import com.digitacourse.api.web.dto.LoginRequest;
import com.digitacourse.api.web.dto.SignupRequest;
import java.time.Instant;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserPreferencesRepository preferencesRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AccountService accountService;
    private final DemoDataService demoDataService;

    public AuthService(
            UserRepository userRepository,
            UserPreferencesRepository preferencesRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AccountService accountService,
            DemoDataService demoDataService) {
        this.userRepository = userRepository;
        this.preferencesRepository = preferencesRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.demoDataService = demoDataService;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        UserAccount user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> ApiException.unauthorized("E-mail ou senha incorretos."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("E-mail ou senha incorretos.");
        }

        return session(user);
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("Já existe uma conta com este e-mail. Faça login.");
        }

        UserAccount user = new UserAccount();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole("Aluno");
        user.setJoinedAt(Instant.now());
        userRepository.save(user);

        UserPreferences preferences = new UserPreferences();
        preferences.setUserId(user.getId());
        preferences.setDailyGoalMinutes(10);
        preferences.setPublicProfile(true);
        preferences.setEmailReminders(true);
        preferences.setWeeklySummary(true);
        preferencesRepository.save(preferences);

        Notification welcome = new Notification();
        welcome.setUserId(user.getId());
        welcome.setTitle("Bem-vindo ao DigitaCourse");
        welcome.setMessage("Sua conta está pronta. Comece pela primeira lição da trilha Fundamentos.");
        welcome.setKind("course");
        welcome.setHref("/app/trilhas/fundamentos");
        welcome.setRead(false);
        welcome.setCreatedAt(Instant.now());
        notificationRepository.save(welcome);

        return session(user);
    }

    @Transactional
    public AuthResponse demoLogin() {
        UserAccount demo = demoDataService.ensureDemoAccount();
        return session(demo);
    }

    @Transactional
    public AuthResponse restoreDemo() {
        UserAccount demo = demoDataService.restoreDemoAccount();
        return session(demo);
    }

    private AuthResponse session(UserAccount user) {
        return new AuthResponse(jwtService.createToken(user), accountService.getAccount(user.getId()));
    }
}
