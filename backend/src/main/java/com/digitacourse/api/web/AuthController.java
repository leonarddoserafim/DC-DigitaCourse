package com.digitacourse.api.web;

import com.digitacourse.api.service.AuthService;
import com.digitacourse.api.web.dto.AuthResponse;
import com.digitacourse.api.web.dto.LoginRequest;
import com.digitacourse.api.web.dto.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/demo")
    public AuthResponse demo() {
        return authService.demoLogin();
    }

    @PostMapping("/demo/restore")
    public AuthResponse restoreDemo() {
        return authService.restoreDemo();
    }
}
