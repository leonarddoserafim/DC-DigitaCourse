package com.digitacourse.api.web;

import com.digitacourse.api.security.AuthenticatedUser;
import com.digitacourse.api.service.AccountService;
import com.digitacourse.api.web.dto.AccountView;
import com.digitacourse.api.web.dto.AttemptRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final AccountService accountService;

    public LessonController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/{lessonId}/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public AccountView recordAttempt(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable String lessonId,
            @Valid @RequestBody AttemptRequest request) {
        return accountService.recordAttempt(user.id(), lessonId, request);
    }
}
