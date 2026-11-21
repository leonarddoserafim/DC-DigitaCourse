package com.digitacourse.api.web;

import com.digitacourse.api.security.AuthenticatedUser;
import com.digitacourse.api.service.AccountService;
import com.digitacourse.api.web.dto.AccountView;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final AccountService accountService;

    public NotificationController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PatchMapping("/{notificationId}/read")
    public AccountView markRead(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable UUID notificationId) {
        return accountService.markNotificationRead(user.id(), notificationId);
    }

    @PatchMapping("/read-all")
    public AccountView markAllRead(@AuthenticationPrincipal AuthenticatedUser user) {
        return accountService.markAllNotificationsRead(user.id());
    }
}
