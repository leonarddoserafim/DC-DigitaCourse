package com.digitacourse.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.digitacourse.api.support.ApiIntegrationTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class NotificationIntegrationTest extends ApiIntegrationTestSupport {

    @Test
    @DisplayName("marcar uma notificação como lida atualiza a conta e é idempotente")
    void marcarNotificacaoComoLida() throws Exception {
        String token = demoToken();
        JsonNode account = me(token);
        JsonNode unread = firstUnreadNotification(account);
        assertThat(unread).isNotNull();
        String notificationId = unread.path("id").asText();

        JsonNode updated = json(mockMvc.perform(
                        authorized(patch("/api/notifications/{id}/read", notificationId), token))
                .andExpect(status().isOk()));

        assertThat(unreadNotifications(updated)).isEqualTo(1);
        JsonNode marked = findByField(updated.path("notifications"), "id", notificationId);
        assertThat(marked).isNotNull();
        assertThat(marked.path("read").asBoolean()).isTrue();

        JsonNode repeated = json(mockMvc.perform(
                        authorized(patch("/api/notifications/{id}/read", notificationId), token))
                .andExpect(status().isOk()));
        assertThat(unreadNotifications(repeated)).isEqualTo(1);
    }

    @Test
    @DisplayName("marcar todas as notificações como lidas zera o contador")
    void marcarTodasComoLidas() throws Exception {
        String token = demoToken();

        JsonNode account = json(mockMvc.perform(
                        authorized(patch("/api/notifications/read-all"), token))
                .andExpect(status().isOk()));

        assertThat(account.path("notifications")).hasSize(4);
        assertThat(unreadNotifications(account)).isZero();
        for (JsonNode notification : account.path("notifications")) {
            assertThat(notification.path("read").asBoolean()).isTrue();
        }

        JsonNode persisted = me(token);
        assertThat(unreadNotifications(persisted)).isZero();
    }

    @Test
    @DisplayName("não é possível marcar notificação de outra conta")
    void notificacaoDeOutraContaRetorna404() throws Exception {
        String userToken = signup("Ana Souza", "ana@example.com", "segredo123");
        JsonNode userAccount = me(userToken);
        String userNotificationId = userAccount.path("notifications").get(0).path("id").asText();

        String demoToken = demoToken();
        mockMvc.perform(authorized(
                        patch("/api/notifications/{id}/read", userNotificationId), demoToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Notificação não encontrada."));

        JsonNode persisted = me(userToken);
        assertThat(unreadNotifications(persisted)).isEqualTo(1);
    }

    @Test
    @DisplayName("notificação inexistente retorna 404")
    void notificacaoInexistenteRetorna404() throws Exception {
        String token = demoToken();

        mockMvc.perform(authorized(
                        patch("/api/notifications/{id}/read", UUID.randomUUID()), token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Notificação não encontrada."));
    }
}
