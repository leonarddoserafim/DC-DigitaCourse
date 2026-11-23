package com.digitacourse.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.digitacourse.api.support.ApiIntegrationTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class AccountIntegrationTest extends ApiIntegrationTestSupport {

    @Test
    @DisplayName("perfil atualiza nome, meta e preferências e persiste")
    void perfilAtualizaNomeMetaEPreferencias() throws Exception {
        String token = demoToken();

        JsonNode updated = json(mockMvc.perform(authorized(patch("/api/me"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Marina Souza","dailyGoalMinutes":15,"publicProfile":false,"emailReminders":false,"weeklySummary":false}
                                """))
                .andExpect(status().isOk()));

        assertThat(updated.path("user").path("name").asText()).isEqualTo("Marina Souza");
        assertThat(updated.path("prefs").path("dailyGoalMinutes").asInt()).isEqualTo(15);
        assertThat(updated.path("prefs").path("publicProfile").asBoolean()).isFalse();
        assertThat(updated.path("prefs").path("emailReminders").asBoolean()).isFalse();
        assertThat(updated.path("prefs").path("weeklySummary").asBoolean()).isFalse();

        JsonNode persisted = me(token);
        assertThat(persisted.path("user").path("name").asText()).isEqualTo("Marina Souza");
        assertThat(persisted.path("prefs").path("dailyGoalMinutes").asInt()).isEqualTo(15);
        assertThat(persisted.path("prefs").path("publicProfile").asBoolean()).isFalse();
    }

    @Test
    @DisplayName("meta diária fora das opções retorna 400")
    void metaDiariaInvalidaRetorna400() throws Exception {
        String token = demoToken();

        mockMvc.perform(authorized(patch("/api/me"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"dailyGoalMinutes":12}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Escolha uma meta diária válida."));
    }

    @Test
    @DisplayName("tentativa em lição bloqueada retorna 409")
    void tentativaEmLicaoBloqueadaRetorna409() throws Exception {
        String token = demoToken();

        mockMvc.perform(authorized(post("/api/lessons/dia-04/attempts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"wpm":60,"accuracy":97.0,"durationSeconds":90,"errors":2}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Conclua a lição anterior para liberar este exercício."));
    }

    @Test
    @DisplayName("tentativa em lição inexistente retorna 404")
    void tentativaEmLicaoInexistenteRetorna404() throws Exception {
        String token = demoToken();

        mockMvc.perform(authorized(post("/api/lessons/nao-existe/attempts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"wpm":60,"accuracy":97.0,"durationSeconds":90,"errors":2}
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Lição não encontrada."));
    }

    @Test
    @DisplayName("tentativa válida persiste, conclui a lição e concede bônus de XP")
    void tentativaValidaPersisteConclusaoEBonus() throws Exception {
        String token = demoToken();
        JsonNode lesson = catalogLesson("dia-03");
        assertThat(lesson).isNotNull();
        int characters = lesson.path("text").asText().length();

        JsonNode account = json(mockMvc.perform(authorized(post("/api/lessons/dia-03/attempts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"wpm":72,"accuracy":98.4,"durationSeconds":120,"errors":2}
                                """))
                .andExpect(status().isCreated()));

        assertThat(account.path("attempts")).hasSize(22);
        assertThat(account.path("completedLessons")).hasSize(7);
        assertThat(hasCompletedLesson(account, "dia-03")).isTrue();

        JsonNode attempt = findByField(account.path("attempts"), "lessonId", "dia-03");
        assertThat(attempt).isNotNull();
        assertThat(attempt.path("lessonTitle").asText()).isEqualTo("Mensagens e e-mails");
        assertThat(attempt.path("courseId").asText()).isEqualTo("dia-a-dia");
        assertThat(attempt.path("courseTitle").asText()).isEqualTo("Palavras do dia a dia");
        assertThat(attempt.path("wpm").asInt()).isEqualTo(72);
        assertThat(attempt.path("accuracy").decimalValue()).isEqualByComparingTo("98.4");
        assertThat(attempt.path("durationSeconds").asInt()).isEqualTo(120);
        assertThat(attempt.path("characters").asInt()).isEqualTo(characters);
        assertThat(attempt.path("errors").asInt()).isEqualTo(2);
        assertThat(attempt.path("xp").asInt()).isEqualTo(80);

        JsonNode notification = findByField(account.path("notifications"), "title", "Lição concluída");
        assertThat(notification).isNotNull();
        assertThat(notification.path("message").asText()).contains("+80 XP");
        assertThat(notification.path("read").asBoolean()).isFalse();

        JsonNode persisted = me(token);
        assertThat(persisted.path("attempts")).hasSize(22);
        assertThat(hasCompletedLesson(persisted, "dia-03")).isTrue();
    }

    @Test
    @DisplayName("prática repetida não duplica conclusão e não concede bônus sem precisão")
    void praticaRepetidaNaoDuplicaConclusao() throws Exception {
        String token = demoToken();

        mockMvc.perform(authorized(post("/api/lessons/dia-03/attempts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"wpm":72,"accuracy":98.4,"durationSeconds":120,"errors":2}
                                """))
                .andExpect(status().isCreated());

        JsonNode account = json(mockMvc.perform(authorized(post("/api/lessons/dia-03/attempts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"wpm":65,"accuracy":90.0,"durationSeconds":90,"errors":5}
                                """))
                .andExpect(status().isCreated()));

        assertThat(account.path("attempts")).hasSize(23);
        assertThat(account.path("completedLessons")).hasSize(7);
        assertThat(account.path("notifications")).hasSize(6);

        boolean bonusAttempt = false;
        boolean regularAttempt = false;
        for (JsonNode attempt : account.path("attempts")) {
            if ("dia-03".equals(attempt.path("lessonId").asText())) {
                if (attempt.path("xp").asInt() == 80) {
                    bonusAttempt = true;
                }
                if (attempt.path("xp").asInt() == 70) {
                    regularAttempt = true;
                }
            }
        }
        assertThat(bonusAttempt).isTrue();
        assertThat(regularAttempt).isTrue();

        JsonNode notification = findByField(account.path("notifications"), "title", "Prática registrada");
        assertThat(notification).isNotNull();
        assertThat(notification.path("message").asText()).contains("+70 XP");
    }

    @Test
    @DisplayName("tentativa com WPM fora do limite retorna 400")
    void tentativaComDadosInvalidosRetorna400() throws Exception {
        String token = demoToken();

        mockMvc.perform(authorized(post("/api/lessons/dia-03/attempts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"wpm":500,"accuracy":98.0,"durationSeconds":90,"errors":1}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Velocidade inválida."));
    }

    @Test
    @DisplayName("reset limpa tentativas e conclusões, mantém preferências e registra aviso")
    void resetProgressLimpaTentativasEConclusoes() throws Exception {
        String token = demoToken();

        JsonNode account = json(mockMvc.perform(authorized(post("/api/me/reset-progress"), token))
                .andExpect(status().isOk()));

        assertThat(account.path("attempts")).isEmpty();
        assertThat(account.path("completedLessons")).isEmpty();
        assertThat(account.path("notifications")).hasSize(5);
        assertThat(unreadNotifications(account)).isEqualTo(3);
        assertThat(account.path("prefs").path("dailyGoalMinutes").asInt()).isEqualTo(10);
        assertThat(account.path("user").path("name").asText()).isEqualTo("Marina Costa");

        JsonNode notification = findByField(account.path("notifications"), "title", "Progresso redefinido");
        assertThat(notification).isNotNull();
        assertThat(notification.path("kind").asText()).isEqualTo("goal");
        assertThat(notification.path("href").asText()).isEqualTo("/app/trilhas");
        assertThat(notification.path("read").asBoolean()).isFalse();

        JsonNode persisted = me(token);
        assertThat(persisted.path("attempts")).isEmpty();
        assertThat(persisted.path("completedLessons")).isEmpty();
        assertThat(persisted.path("notifications")).hasSize(5);
    }
}
