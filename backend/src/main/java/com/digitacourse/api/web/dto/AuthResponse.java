package com.digitacourse.api.web.dto;

public record AuthResponse(String token, AccountView account) {
}
