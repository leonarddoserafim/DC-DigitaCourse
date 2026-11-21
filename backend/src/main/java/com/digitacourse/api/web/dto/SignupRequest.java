package com.digitacourse.api.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank(message = "Informe seu nome completo.")
        @Size(min = 2, max = 120, message = "Informe seu nome completo.")
        String name,

        @NotBlank(message = "Informe seu e-mail.")
        @Email(message = "Informe um e-mail válido.")
        String email,

        @NotBlank(message = "Crie uma senha.")
        @Size(min = 6, max = 72, message = "A senha precisa ter pelo menos 6 caracteres.")
        String password) {
}
