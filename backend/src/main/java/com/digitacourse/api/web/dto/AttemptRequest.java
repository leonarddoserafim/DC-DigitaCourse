package com.digitacourse.api.web.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AttemptRequest(
        @NotNull(message = "Informe a velocidade da tentativa.")
        @Min(value = 0, message = "Velocidade inválida.")
        @Max(value = 400, message = "Velocidade inválida.")
        Integer wpm,

        @NotNull(message = "Informe a precisão da tentativa.")
        @DecimalMin(value = "0.0", message = "Precisão inválida.")
        @DecimalMax(value = "100.0", message = "Precisão inválida.")
        Double accuracy,

        @NotNull(message = "Informe a duração da tentativa.")
        @Min(value = 1, message = "Duração inválida.")
        Integer durationSeconds,

        @NotNull(message = "Informe os erros da tentativa.")
        @Min(value = 0, message = "Erros inválidos.")
        Integer errors) {
}
