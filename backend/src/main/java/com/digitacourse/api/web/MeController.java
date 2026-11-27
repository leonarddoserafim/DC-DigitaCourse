package com.digitacourse.api.web;

import com.digitacourse.api.security.AuthenticatedUser;
import com.digitacourse.api.service.AccountService;
import com.digitacourse.api.web.dto.AccountView;
import com.digitacourse.api.web.dto.ProfileUpdateRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final AccountService accountService;

    public MeController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public AccountView me(@AuthenticationPrincipal AuthenticatedUser user) {
        return accountService.getAccount(user.id());
    }

    @PatchMapping
    public AccountView updateProfile(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody ProfileUpdateRequest request) {
        return accountService.updateProfile(user.id(), request);
    }

    @PostMapping("/reset-progress")
    public AccountView resetProgress(@AuthenticationPrincipal AuthenticatedUser user) {
        return accountService.resetProgress(user.id());
    }
}
