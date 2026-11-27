# Entrega 01 — Testes de integração da API e banco de teste reproduzível

| Campo | Valor |
| --- | --- |
| **Status** | Concluída |
| **Data** | 23/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Etapa 03 |
| **Stack** | JUnit 5, Spring Boot Test, MockMvc, AssertJ, PostgreSQL 17.6, Flyway, Maven |
| **Documento mestre** | [Roadmap de 20 entregas](README.md) |

---

## 1. Objetivo

Criar a primeira fundação de qualidade do DigitaCourse: uma suíte de testes de integração versionada, executável por qualquer pessoa, que valide os contratos reais da API contra um PostgreSQL dedicado sem colocar em risco o banco de desenvolvimento.

Esta entrega não altera o comportamento do produto. Ela transforma as verificações manuais da Etapa 03 em código permanente e reproduzível.

---

## 2. Problema encontrado

A Etapa 03 foi validada com 25 verificações de API e 27 verificações de interface. Porém:

- os scripts de API e UI estavam em arquivos temporários fora do repositório;
- não existia `backend/src/test`;
- não havia banco de teste separado;
- qualquer regressão futura dependeria de repetir um roteiro manual;
- a limpeza de contas de teste era feita à mão no PostgreSQL;
- não havia proteção contra uma suíte apontar por engano para o banco `digitacourse`;
- não havia base automatizada para as próximas entregas do roadmap.

---

## 3. Escopo entregue

- Perfil Spring `test` com banco PostgreSQL dedicado `digitacourse_test`.
- Dependências de teste já presentes no `pom.xml` aproveitadas: `spring-boot-starter-test` e `spring-security-test`.
- Classe base de integração com `@SpringBootTest`, `@AutoConfigureMockMvc` e `@ActiveProfiles("test")`.
- Limpeza determinística antes de cada teste.
- Restauração da conta demo antes de cada teste.
- Proteção que valida o nome do banco antes de qualquer exclusão.
- 24 testes distribuídos em quatro classes:
  - saúde e catálogo;
  - autenticação e cadastro;
  - conta, tentativas e reset;
  - notificações.
- Documentação de execução, decisões, cobertura e resultados.

### Fora de escopo

- Testes de componentes, E2E ou acessibilidade do front-end.
- Pipeline de CI.
- Testcontainers.
- Cobertura mínima ou relatório JaCoCo.
- Testes de carga, concorrência ou caos.
- Alterações em regras de negócio, schema ou interface.

---

## 4. Decisões tomadas

### 4.1 PostgreSQL real em vez de H2

A suíte usa o mesmo banco relacional do produto. Isso preserva comportamentos que um banco em memória não reproduziria com fidelidade:

- constraints de schema;
- `timestamptz` e fuso UTC;
- `numeric(4,1)` da precisão;
- chaves estrangeiras com `on delete cascade`;
- migrações Flyway;
- validação do schema pelo Hibernate.

H2 foi descartado nesta entrega para evitar divergências de dialeto e falsa confiança.

### 4.2 Banco dedicado `digitacourse_test`

O perfil `test` aponta para um banco separado do ambiente de desenvolvimento:

```text
jdbc:postgresql://127.0.0.1:5432/digitacourse_test
```

A URL, o usuário, a senha e o segredo JWT podem ser sobrescritos por variáveis de ambiente próprias de teste. O banco `digitacourse` não é usado pela suíte.

### 4.3 MockMvc com contexto completo

Os testes sobem o contexto Spring completo e chamam a API via `MockMvc`. Assim, validam de ponta a ponta:

- filtro JWT;
- Spring Security e respostas `401`;
- controllers e DTOs;
- validação Jakarta;
- serviços e transações;
- repositórios JPA;
- tratamento centralizado de erros;
- serialização JSON.

Mocks de service foram descartados porque não validariam as regras reais de tentativa, reset, restauração e notificações.

### 4.4 Limpeza determinística

Antes de cada teste, a classe base:

1. confere o nome do banco atual;
2. remove usuários cujo e-mail não seja o da demo;
3. restaura a conta demo ao estado documentado.

Com isso, cada teste começa com:

```text
1 usuário demo · 21 tentativas · 6 lições concluídas · 4 notificações · meta 10 min
```

A ordem dos testes não importa. Nenhum teste depende do que outro deixou no banco.

### 4.5 Proteção contra limpeza acidental

A primeira ação da classe base é executar:

```sql
select current_database();
```

Se o resultado não for `digitacourse_test`, a suíte falha antes de qualquer `delete`. Essa proteção evita que uma configuração errada apague dados do banco de desenvolvimento.

### 4.6 Sem Testcontainers nesta etapa

O ambiente usa ferramentas portáteis locais e PostgreSQL já disponível. Testcontainers exigiria Docker no ambiente de execução. A decisão mantém a suíte simples agora; a Entrega 02 pode subir um serviço PostgreSQL na CI.

### 4.7 Sem execução paralela

Os testes compartilham o mesmo banco e restauram a demo antes de cada método. A execução paralela fica desabilitada por padrão. Se necessário no futuro, será preciso isolar dados por schema ou por usuário.

---

## 5. Arquitetura dos testes

```text
backend/src/test/
├── java/com/digitacourse/api/
│   ├── AccountIntegrationTest.java
│   ├── AuthIntegrationTest.java
│   ├── HealthAndCatalogIntegrationTest.java
│   ├── NotificationIntegrationTest.java
│   └── support/
│       └── ApiIntegrationTestSupport.java
└── resources/
    └── application-test.yml
```

### 5.1 Classe base

`ApiIntegrationTestSupport` concentra:

- configuração do contexto de teste;
- acesso ao `MockMvc`, `ObjectMapper`, `JdbcTemplate` e `DemoDataService`;
- limpeza e restauração antes de cada teste;
- helpers para login demo, cadastro, requisições autenticadas, leitura de JSON, busca de lição no catálogo, notificações não lidas e lições concluídas.

### 5.2 Perfil de teste

`application-test.yml` define:

- banco `digitacourse_test`;
- `ddl-auto: validate`;
- Flyway habilitado e `clean-disabled: true`;
- segredo JWT exclusivo de teste;
- expiração curta de token;
- CORS local;
- logs mais silenciosos.

---

## 6. Cobertura dos testes

### 6.1 Saúde e catálogo — 3 testes

| Teste | O que valida |
| --- | --- |
| Health check | `200`, status `ok`, banco `postgresql`, serviço `digitacourse-api` |
| Catálogo completo | 3 trilhas, 6 módulos, 12 lições, ordem e dados da primeira lição |
| Catálogo público | Acesso sem token e estrutura aninhada |

### 6.2 Autenticação — 9 testes

| Teste | O que valida |
| --- | --- |
| Login demo | Token, nome, e-mail, papel, preferências, 21 tentativas, 6 lições, 4 notificações e 2 não lidas |
| Login por credenciais | `marina@digitacourse.com` / `demo1234` sem atalho |
| Senha incorreta | `401` com mensagem em pt-BR |
| Rota protegida sem token | `401` e mensagem de sessão expirada |
| Token inválido | `401`, sem autenticação parcial |
| Cadastro | Normalização de e-mail, papel, preferências padrão, listas vazias e boas-vindas |
| Cadastro duplicado | `409`, inclusive com diferença de maiúsculas/minúsculas |
| Senha curta | `400` com mensagem de validação |
| Restauração da demo | Reverte nome, meta, tentativas, lições e notificações e persiste |

### 6.3 Conta e progresso — 8 testes

| Teste | O que valida |
| --- | --- |
| Perfil | Nome, meta e três preferências persistidos |
| Meta inválida | `400` para valor fora das opções permitidas |
| Lição bloqueada | `409` ao tentar `dia-04` sem concluir `dia-03` |
| Lição inexistente | `404` |
| Tentativa válida | Persistência, conclusão, personagens, XP com bônus e notificação |
| Prática repetida | Não duplica conclusão, não concede bônus indevido e cria aviso de prática |
| WPM inválido | `400` |
| Reset | Limpa tentativas e conclusões, mantém preferências e cria notificação |

### 6.4 Notificações — 4 testes

| Teste | O que valida |
| --- | --- |
| Marcar uma como lida | Contador atualizado e operação idempotente |
| Marcar todas | Todas lidas e contador zerado |
| Notificação de outra conta | `404`, sem vazamento entre usuários |
| Notificação inexistente | `404` |

**Total: 24 testes.**

---

## 7. Como executar

### 7.1 Pré-requisitos

- JDK 21;
- Maven 3.9+;
- PostgreSQL 17 em `127.0.0.1:5432`.

### 7.2 Criar o banco de teste

Na primeira execução:

```bash
createdb -h 127.0.0.1 -p 5432 -U postgres digitacourse_test
```

O Flyway aplica `V1__schema.sql` e `V2__seed_catalog.sql` automaticamente na primeira execução da suíte.

### 7.3 Executar

```bash
cd backend
mvn -B test
```

No PowerShell do Windows, use `mvn.cmd` se a política de scripts bloquear `mvn.ps1`.

### 7.4 Variáveis opcionais

| Variável | Padrão |
| --- | --- |
| `DIGITACOURSE_TEST_DB_URL` | `jdbc:postgresql://127.0.0.1:5432/digitacourse_test` |
| `DIGITACOURSE_TEST_DB_USER` | `postgres` |
| `DIGITACOURSE_TEST_DB_PASSWORD` | vazio |
| `DIGITACOURSE_TEST_JWT_SECRET` | Chave exclusiva de teste com 32+ caracteres |

### 7.5 Resultado esperado

```text
Tests run: 24, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

---

## 8. Resultados da validação

### 8.1 Execução da suíte

| Item | Resultado |
| --- | --- |
| Comando | `mvn -B test` |
| Testes executados | 24 |
| Falhas | 0 |
| Erros | 0 |
| Testes ignorados | 0 |
| Build | `BUILD SUCCESS` |
| Tempo total da execução | 39,5 s na primeira execução, incluindo download de dependências; 23,2 s na segunda |

Uma segunda execução consecutiva também passou com 24/24 testes, confirmando que a limpeza e a restauração da demo são repetíveis. Uma execução com `mvn clean test` recompilou os 41 arquivos principais e os 5 arquivos de teste do zero e passou com 24/24 em 35,4 s.

Detalhe por classe:

| Classe | Testes | Tempo aproximado |
| --- | --- | --- |
| `AccountIntegrationTest` | 8 | 14,3 s, incluindo inicialização do contexto |
| `AuthIntegrationTest` | 9 | 1,9 s |
| `HealthAndCatalogIntegrationTest` | 3 | 0,2 s |
| `NotificationIntegrationTest` | 4 | 0,9 s |

### 8.2 Flyway no banco de teste

| Versão | Descrição | Sucesso |
| --- | --- | --- |
| 1 | schema | true |
| 2 | seed catalog | true |

### 8.3 Isolamento dos bancos

Estado após a execução:

| Banco | Usuários | Tentativas | Lições | Notificações |
| --- | --- | --- | --- | --- |
| `digitacourse` | 1 | 21 | 6 | 4 |
| `digitacourse_test` | 1 | 21 | 6 | 4 |

O banco de teste terminou apenas com `marina@digitacourse.com`. O banco de desenvolvimento permaneceu intacto e com o estado documentado da demo.

---

## 9. Segurança e isolamento

- A suíte só limpa o banco após confirmar `current_database() = digitacourse_test`.
- Usuários de teste são removidos antes de cada método.
- A conta demo existente é restaurada, não recriada como usuário paralelo.
- O segredo JWT de teste é diferente do padrão de desenvolvimento.
- Nenhuma credencial real é necessária para o ambiente local com `trust`.
- Nenhum dado de produção é usado.
- A suíte não desabilita Flyway nem usa `ddl-auto: create-drop`.

---

## 10. Limitações

- Exige PostgreSQL ativo; não é uma suíte autocontida com Docker.
- Não cobre front-end, acessibilidade, carga ou concorrência.
- Não mede cobertura de código.
- Não executa em paralelo.
- Ainda não roda em CI; isso pertence à Entrega 02.
- A restauração pública da demo continua existindo; a proteção pertence à Entrega 11.
- A suíte não recria o banco do zero a cada execução; a primeira execução aplicou V1 e V2 em um banco vazio, mas esse caminho não é revalidado automaticamente em toda rodada.
- Rate limiting, e-mail e área administrativa ainda não existem, portanto não são testados.

---

## 11. Critérios de aceite

- [x] Existe suíte versionada em `backend/src/test`.
- [x] A suíte usa PostgreSQL real e banco dedicado.
- [x] O perfil `test` não usa o banco `digitacourse`.
- [x] A suíte valida o nome do banco antes de limpar dados.
- [x] A demo é restaurada antes de cada teste.
- [x] Usuários criados nos testes são removidos.
- [x] Saúde e catálogo são cobertos.
- [x] Login demo, login por senha, cadastro, duplicidade e validações são cobertos.
- [x] Rotas protegidas sem token e com token inválido retornam `401`.
- [x] Perfil, tentativas, bloqueio sequencial, bônus de XP e reset são cobertos.
- [x] Notificações individuais, em lote, de outra conta e inexistentes são cobertas.
- [x] Restauração da demo é coberta e persiste.
- [x] `mvn test` termina com 24 testes e zero falhas.
- [x] O banco de desenvolvimento permanece com 21 tentativas, 6 lições e 4 notificações.
- [x] A execução está documentada no README do backend e neste arquivo.

---

## 12. Arquivos entregues

| Arquivo | Função |
| --- | --- |
| `backend/src/test/resources/application-test.yml` | Perfil de teste com PostgreSQL dedicado |
| `backend/src/test/java/.../support/ApiIntegrationTestSupport.java` | Base, limpeza, guarda de banco e helpers |
| `backend/src/test/java/.../HealthAndCatalogIntegrationTest.java` | Saúde e catálogo |
| `backend/src/test/java/.../AuthIntegrationTest.java` | Login, cadastro, sessão e restauração |
| `backend/src/test/java/.../AccountIntegrationTest.java` | Perfil, tentativas, XP e reset |
| `backend/src/test/java/.../NotificationIntegrationTest.java` | Leitura e isolamento de notificações |
| `docs/entregas/README.md` | Roadmap com as 20 entregas |
| `docs/entregas/entrega-01-testes-de-integracao.md` | Este documento |
| `backend/README.md` | Instruções de teste atualizadas |
| `docs/README.md` | Índice de entregas atualizado |
| `README.md` | Status, estrutura e execução atualizados |

Nenhum arquivo de código de produção foi alterado.

---

## 13. Próximos passos

1. **Entrega 02:** versionar o projeto e criar a pipeline de CI que executa esta suíte com PostgreSQL de serviço.
2. **Entrega 03:** adicionar lint e formatação ao front-end.
3. **Entrega 04:** criar testes de componentes e E2E dos fluxos críticos.
4. **Entrega 06:** documentar o contrato da API com OpenAPI.
5. Manter a suíte verde em toda entrega seguinte.

---

## 14. Histórico

| Data | Evento |
| --- | --- |
| 23/11/2026 | Banco `digitacourse_test` criado e perfil de teste configurado |
| 23/11/2026 | Classe base, guarda de banco e helpers implementados |
| 23/11/2026 | 24 testes de integração implementados |
| 23/11/2026 | `mvn -B test` aprovado com 24/24 testes |
| 23/11/2026 | Isolamento dos bancos e estado final verificados |
| 23/11/2026 | Documentação publicada |
