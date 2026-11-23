package com.digitacourse.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.digitacourse.api.support.ApiIntegrationTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

class AuthIntegrationTest extends ApiIntegrationTestSupport {

    @Test
    @DisplayName("login demo devolve token e o estado completo da conta")
    void loginDemoEntregaTokenEContaCompleta() throws Exception {
        JsonNode response = json(mockMvc.perform(post("/api/auth/demo"))
                .andExpect(status().isOk()));

        assertThat(response.path("token").asText()).isNotBlank();

        JsonNode account = response.path("account");
        assertThat(account.path("user").path("name").asText()).isEqualTo("Marina Costa");
        assertThat(account.path("user").path("email").asText()).isEqualTo(DEMO_EMAIL);
        assertThat(account.path("user").path("role").asText()).isEqualTo("Aluno");
        assertThat(account.path("prefs").path("dailyGoalMinutes").asInt()).isEqualTo(10);
        assertThat(account.path("prefs").path("publicProfile").asBoolean()).isTrue();
        assertThat(account.path("attempts")).hasSize(21);
        assertThat(account.path("completedLessons")).hasSize(6);
        assertThat(hasCompletedLesson(account, "fund-01")).isTrue();
        assertThat(hasCompletedLesson(account, "dia-02")).isTrue();
        assertThat(account.path("notifications")).hasSize(4);
        assertThat(unreadNotifications(account)).isEqualTo(2);
    }

    @Test
    @DisplayName("login com as credenciais demo funciona sem atalho")
    void loginComCredenciaisDemoFunciona() throws Exception {
        JsonNode response = json(mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", DEMO_EMAIL,
                                "password", DEMO_PASSWORD))))
                .andExpect(status().isOk()));

        assertThat(response.path("token").asText()).isNotBlank();
        assertThat(response.path("account").path("user").path("email").asText()).isEqualTo(DEMO_EMAIL);
        assertThat(response.path("account").path("attempts")).hasSize(21);
    }

    @Test
    @DisplayName("login com senha incorreta retorna 401")
    void loginComSenhaIncorretaRetorna401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", DEMO_EMAIL,
                                "password", "senha-errada"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("E-mail ou senha incorretos."));
    }

    @Test
    @DisplayName("rota protegida sem token retorna 401")
    void rotaProtegidaSemTokenRetorna401() throws Exception {
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Sessão expirada. Entre novamente."));
    }

    @Test
    @DisplayName("token inválido não autentica e retorna 401")
    void tokenInvalidoRetorna401() throws Exception {
        mockMvc.perform(get("/api/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer token-invalido"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Sessão expirada. Entre novamente."));
    }

    @Test
    @DisplayName("cadastro cria conta com padrões, sessão e boas-vindas")
    void cadastroCriaContaComPadroesENotificacaoDeBoasVindas() throws Exception {
        String token = signup("Ana Souza", "Ana.Souza@Example.com", "segredo123");
        JsonNode account = me(token);

        assertThat(account.path("user").path("name").asText()).isEqualTo("Ana Souza");
        assertThat(account.path("user").path("email").asText()).isEqualTo("ana.souza@example.com");
        assertThat(account.path("user").path("role").asText()).isEqualTo("Aluno");
        assertThat(account.path("user").path("joinedAt").asText()).isNotBlank();

        assertThat(account.path("prefs").path("dailyGoalMinutes").asInt()).isEqualTo(10);
        assertThat(account.path("prefs").path("publicProfile").asBoolean()).isTrue();
        assertThat(account.path("prefs").path("emailReminders").asBoolean()).isTrue();
        assertThat(account.path("prefs").path("weeklySummary").asBoolean()).isTrue();

        assertThat(account.path("completedLessons")).isEmpty();
        assertThat(account.path("attempts")).isEmpty();
        assertThat(account.path("notifications")).hasSize(1);

        JsonNode welcome = account.path("notifications").get(0);
        assertThat(welcome.path("title").asText()).isEqualTo("Bem-vindo ao DigitaCourse");
        assertThat(welcome.path("kind").asText()).isEqualTo("course");
        assertThat(welcome.path("href").asText()).isEqualTo("/app/trilhas/fundamentos");
        assertThat(welcome.path("read").asBoolean()).isFalse();
    }

    @Test
    @DisplayName("cadastro com e-mail já existente retorna 409")
    void cadastroDuplicadoRetorna409() throws Exception {
        signup("Ana Souza", "ana@example.com", "segredo123");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Outra Ana",
                                "email", "ANA@example.com",
                                "password", "segredo456"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Já existe uma conta com este e-mail. Faça login."));
    }

    @Test
    @DisplayName("cadastro com senha curta retorna 400")
    void cadastroComSenhaCurtaRetorna400() throws Exception {
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Ana Souza",
                                "email", "ana@example.com",
                                "password", "12345"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("A senha precisa ter pelo menos 6 caracteres."));
    }

    @Test
    @DisplayName("restauração da demo recria o estado documentado")
    void restauracaoDaDemoRecriaEstadoOriginal() throws Exception {
        String token = demoToken();

        mockMvc.perform(authorized(patch("/api/me"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Marina Alterada","dailyGoalMinutes":20}
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(authorized(post("/api/lessons/dia-03/attempts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"wpm":70,"accuracy":98.0,"durationSeconds":100,"errors":1}
                                """))
                .andExpect(status().isCreated());

        JsonNode response = json(mockMvc.perform(post("/api/auth/demo/restore"))
                .andExpect(status().isOk()));
        JsonNode restored = response.path("account");

        assertThat(response.path("token").asText()).isNotBlank();
        assertThat(restored.path("user").path("name").asText()).isEqualTo("Marina Costa");
        assertThat(restored.path("prefs").path("dailyGoalMinutes").asInt()).isEqualTo(10);
        assertThat(restored.path("attempts")).hasSize(21);
        assertThat(restored.path("completedLessons")).hasSize(6);
        assertThat(restored.path("notifications")).hasSize(4);
        assertThat(unreadNotifications(restored)).isEqualTo(2);
        assertThat(hasCompletedLesson(restored, "dia-03")).isFalse();

        JsonNode persisted = me(response.path("token").asText());
        assertThat(persisted.path("attempts")).hasSize(21);
        assertThat(persisted.path("completedLessons")).hasSize(6);
        assertThat(persisted.path("prefs").path("dailyGoalMinutes").asInt()).isEqualTo(10);
    }
}
