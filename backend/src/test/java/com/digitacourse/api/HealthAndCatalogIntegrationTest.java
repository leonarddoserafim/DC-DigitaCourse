package com.digitacourse.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.digitacourse.api.support.ApiIntegrationTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class HealthAndCatalogIntegrationTest extends ApiIntegrationTestSupport {

    @Test
    @DisplayName("health check confirma o serviço e a conexão com o PostgreSQL")
    void healthCheckConfirmaServicoEPostgresql() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.database").value("postgresql"))
                .andExpect(jsonPath("$.service").value("digitacourse-api"));
    }

    @Test
    @DisplayName("catálogo público entrega 3 trilhas, 6 módulos e 12 lições")
    void catalogoPublicoEntregaEstruturaCompleta() throws Exception {
        JsonNode catalog = json(mockMvc.perform(get("/api/catalog")).andExpect(status().isOk()));

        assertThat(catalog).hasSize(3);
        assertThat(catalog.get(0).path("id").asText()).isEqualTo("fundamentos");
        assertThat(catalog.get(1).path("id").asText()).isEqualTo("dia-a-dia");
        assertThat(catalog.get(2).path("id").asText()).isEqualTo("fluencia");

        int modules = 0;
        int lessons = 0;
        for (JsonNode course : catalog) {
            modules += course.path("modules").size();
            for (JsonNode module : course.path("modules")) {
                lessons += module.path("lessons").size();
            }
        }

        assertThat(modules).isEqualTo(6);
        assertThat(lessons).isEqualTo(12);

        JsonNode firstLesson = catalog.get(0).path("modules").get(0).path("lessons").get(0);
        assertThat(firstLesson.path("id").asText()).isEqualTo("fund-01");
        assertThat(firstLesson.path("title").asText()).isEqualTo("Encontre a posição das mãos");
        assertThat(firstLesson.path("xp").asInt()).isEqualTo(40);
        assertThat(firstLesson.path("text").asText()).isNotBlank();
    }

    @Test
    @DisplayName("catálogo é público e não exige token")
    void catalogoEDispensaToken() throws Exception {
        mockMvc.perform(get("/api/catalog"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].modules[0].lessons[0].id").value("fund-01"));
    }
}
