package com.digitacourse.api.support;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.digitacourse.api.service.DemoDataService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/**
 * Base dos testes de integração da API.
 *
 * <p>Os testes usam um PostgreSQL real e um banco dedicado. Antes de qualquer limpeza, a base
 * confere o nome do banco para impedir que uma configuração errada apague dados de desenvolvimento.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class ApiIntegrationTestSupport {

    protected static final String DEMO_EMAIL = DemoDataService.DEMO_EMAIL;
    protected static final String DEMO_PASSWORD = DemoDataService.DEMO_PASSWORD;

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected DemoDataService demoDataService;

    @BeforeEach
    void resetDatabase() {
        String database = jdbcTemplate.queryForObject("select current_database()", String.class);
        assertThat(database)
                .as("Os testes de integração só podem limpar o banco dedicado digitacourse_test")
                .isEqualTo("digitacourse_test");

        jdbcTemplate.update("delete from users where email <> ?", DEMO_EMAIL);
        demoDataService.restoreDemoAccount();
    }

    protected String demoToken() throws Exception {
        return token(mockMvc.perform(post("/api/auth/demo")).andExpect(status().isOk()));
    }

    protected String signup(String name, String email, String password) throws Exception {
        return token(mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", name,
                                "email", email,
                                "password", password))))
                .andExpect(status().isCreated()));
    }

    protected MockHttpServletRequestBuilder authorized(
            MockHttpServletRequestBuilder request,
            String token) {
        return request.header(HttpHeaders.AUTHORIZATION, "Bearer " + token);
    }

    protected JsonNode json(ResultActions actions) throws Exception {
        return objectMapper.readTree(
                actions.andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8));
    }

    protected String token(ResultActions actions) throws Exception {
        return json(actions).path("token").asText();
    }

    protected JsonNode me(String token) throws Exception {
        return json(mockMvc.perform(authorized(get("/api/me"), token)).andExpect(status().isOk()));
    }

    protected JsonNode catalogLesson(String lessonId) throws Exception {
        JsonNode catalog = json(mockMvc.perform(get("/api/catalog")).andExpect(status().isOk()));
        for (JsonNode course : catalog) {
            for (JsonNode module : course.path("modules")) {
                for (JsonNode lesson : module.path("lessons")) {
                    if (lessonId.equals(lesson.path("id").asText())) {
                        return lesson;
                    }
                }
            }
        }
        return null;
    }

    protected JsonNode findByField(JsonNode array, String field, String value) {
        for (JsonNode item : array) {
            if (value.equals(item.path(field).asText())) {
                return item;
            }
        }
        return null;
    }

    protected JsonNode firstUnreadNotification(JsonNode account) {
        for (JsonNode notification : account.path("notifications")) {
            if (!notification.path("read").asBoolean()) {
                return notification;
            }
        }
        return null;
    }

    protected long unreadNotifications(JsonNode account) {
        long unread = 0;
        for (JsonNode notification : account.path("notifications")) {
            if (!notification.path("read").asBoolean()) {
                unread++;
            }
        }
        return unread;
    }

    protected boolean hasCompletedLesson(JsonNode account, String lessonId) {
        for (JsonNode completed : account.path("completedLessons")) {
            if (lessonId.equals(completed.asText())) {
                return true;
            }
        }
        return false;
    }
}
