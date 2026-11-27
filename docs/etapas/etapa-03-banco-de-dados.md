# Etapa 03 — Banco de dados, autenticação e persistência

| Campo | Valor |
| --- | --- |
| **Status** | Concluída |
| **Data** | 21/11/2026 |
| **Entrega** | API Spring Boot + PostgreSQL, autenticação JWT e integração completa do front-end |
| **Stack** | Spring Boot 3.4.5, Java 21, PostgreSQL 17.6, Flyway, React 18 + Vite 8 |
| **Idioma** | Português (pt-BR) |

> **Evolução posterior:** a limitação de testes versionados foi resolvida na [Entrega 01 do roadmap de evolução](../entregas/entrega-01-testes-de-integracao.md). Este documento permanece como registro histórico da Etapa 03.

---

## 1. Objetivo

Conectar o DigitaCourse a um banco de dados real, substituindo a simulação em `localStorage` da Etapa 02 por uma API com autenticação, persistência e regras de negócio no servidor.

Esta etapa teve como objetivo:

- criar uma API Spring Boot organizada em camadas;
- modelar o banco PostgreSQL com migrações versionadas pelo Flyway;
- implementar cadastro, login, sessão JWT e hash de senha com BCrypt;
- persistir contas, preferências, tentativas, lições concluídas e notificações;
- manter o catálogo de trilhas, módulos e lições no banco, servido por `GET /api/catalog`;
- preservar a identidade visual e todos os fluxos entregues na Etapa 02;
- manter o cálculo de métricas derivadas no front-end;
- validar a integração ponta a ponta com API, banco e navegador reais;
- documentar arquitetura, schema, endpoints, segurança, execução e limites.

A área administrativa continua **fora de escopo**, assim como o envio real de e-mails.

---

## 2. Contexto e relação com a Etapa 02

A Etapa 02 entregou a experiência completa do aluno, mas com dados simulados. A Etapa 03 mantém a interface e troca a camada de persistência.

| Item | Etapa 02 | Etapa 03 |
| --- | --- | --- |
| Contas | Objeto no `localStorage` | Tabela `users` no PostgreSQL |
| Senhas | Não eram armazenadas | Hash BCrypt em `password_hash` |
| Sessão | `userId` no `localStorage` | JWT assinado, válido por 168 horas |
| Catálogo | Arquivo `courses.js` | Tabelas `courses`, `course_modules` e `lessons` |
| Tentativas | Objeto da conta no navegador | Tabela `attempts` |
| Lições concluídas | Lista no navegador | Tabela `completed_lessons` |
| Preferências | Objeto no navegador | Tabela `user_preferences` |
| Notificações | Geradas no cliente | Tabela `notifications` |
| Conta demo | Recriada localmente | Seed idempotente no startup + restauração pela API |
| Login demo | Qualquer senha com 4+ caracteres | Senha real `demo1234` |
| Logout | Voltava para a landing page | Remove o token e volta para `/entrar` |
| Recuperação de senha | Simulada | Continua sem envio real de e-mail |
| Ranking | Fictício e calculado no cliente | Inalterado nesta etapa |
| Área administrativa | Fora de escopo | Continua fora de escopo |

O visual, as rotas, os componentes, o motor de digitação e as métricas derivadas foram preservados. O que mudou foi a origem e o destino dos dados.

---

## 3. Escopo entregue

### Incluído

- Projeto Maven `backend/` com Spring Boot 3.4.5 e Java 21.
- PostgreSQL local, banco `digitacourse`.
- Migrações Flyway `V1__schema.sql` e `V2__seed_catalog.sql`.
- Schema relacional com oito tabelas de domínio, chaves estrangeiras, índices e constraints.
- API REST em `/api` com DTOs, validação, tratamento centralizado de erros e CORS.
- Cadastro, login, login demo e restauração da demo.
- JWT stateless com validade de 168 horas e filtro de autenticação.
- Senhas com hash BCrypt.
- Catálogo público servido pelo banco.
- Conta autenticada com perfil, preferências, tentativas, lições concluídas e notificações.
- Registro de tentativas com bloqueio sequencial de lições e bônus de XP por precisão.
- Redefinição de progresso e restauração da conta demo.
- Leitura individual e em lote de notificações.
- Seed idempotente da conta demo no startup.
- Cliente HTTP no front-end (`src/lib/api.js`) com tratamento de erros e expiração de sessão.
- `AppContext` assíncrono, carregamento de sessão e estados de envio nas telas.
- Remoção das chaves antigas de conta e sessão do `localStorage`.
- Proxy `/api` no Vite para o ambiente de desenvolvimento.
- Build do backend e do front-end validados.
- 25 verificações de API e 27 verificações de interface aprovadas.
- Dezessete capturas da etapa em `docs/assets/etapa-03/`.

### Deliberadamente fora de escopo

- Área administrativa, gestão de alunos, trilhas ou relatórios.
- Envio real de e-mail, verificação de conta e recuperação de senha por e-mail.
- Refresh token, revogação de JWT, lista de sessões ou logout no servidor.
- Login social, OAuth, MFA ou biometria.
- Upload de avatar, exclusão definitiva de conta ou edição de e-mail.
- Ranking real, moderação, anti-fraude ou competição entre contas.
- Pagamentos, matrículas ou integração institucional.
- Deploy em produção, HTTPS, domínio e fallback de SPA no host.
- Testes automatizados versionados no repositório, lint e auditoria de acessibilidade.
- Notificações push ou WebSocket.

---

## 4. Arquitetura

```text
┌──────────────────────────────────────────────────────────┐
│ Navegador — React + Vite                                  │
│ http://127.0.0.1:5173                                     │
│                                                          │
│  Landing page · Login · Cadastro · Área do aluno         │
│  Motor de digitação · Métricas derivadas em src/lib      │
└───────────────────────────┬──────────────────────────────┘
                            │ HTTP/JSON
                            │ Authorization: Bearer <JWT>
                            ▼
┌──────────────────────────────────────────────────────────┐
│ API Spring Boot                                           │
│ http://127.0.0.1:8080/api                                 │
│                                                          │
│  Controllers → Services → Repositories → JPA/Hibernate   │
│  Security · JWT · BCrypt · CORS · Validação              │
└───────────────────────────┬──────────────────────────────┘
                            │ JDBC / HikariCP
                            ▼
┌──────────────────────────────────────────────────────────┐
│ PostgreSQL 17.6                                           │
│ 127.0.0.1:5432/digitacourse                               │
│                                                          │
│  Flyway: V1 schema + V2 catálogo                          │
└──────────────────────────────────────────────────────────┘
```

Em desenvolvimento, o Vite faz proxy de `/api` para `http://127.0.0.1:8080`. Assim, o front-end usa caminhos relativos e não precisa de configuração extra de CORS no navegador.

### Fluxo de uma requisição autenticada

1. O aluno envia e-mail e senha para `POST /api/auth/login`.
2. A API valida o hash BCrypt e devolve um JWT + o snapshot da conta.
3. O front-end guarda apenas o token em `digitacourse:token:v1`.
4. Nas chamadas seguintes, o cliente envia `Authorization: Bearer <token>`.
5. O filtro JWT valida a assinatura, carrega o usuário e injeta o principal na requisição.
6. O controller chama o serviço, que aplica as regras e persiste via JPA.
7. A resposta devolve o snapshot atualizado da conta; o `AppContext` substitui o estado.

---

## 5. Decisões tomadas

### 5.1 Spring Boot + PostgreSQL

A stack já estava prevista na arquitetura do projeto. Spring Boot oferece:

- configuração rápida de REST, JPA e segurança;
- validação declarativa com Jakarta Validation;
- integração nativa com Flyway;
- ecossistema maduro para testes e evolução.

O PostgreSQL foi escolhido por ser relacional, gratuito, robusto e adequado ao modelo de usuários, catálogo e histórico.

### 5.2 Flyway como fonte da verdade do schema

O schema não é criado pelo Hibernate. As migrações ficam em `backend/src/main/resources/db/migration`, e o `ddl-auto` está em `validate`.

Benefícios:

- schema reproduzível em qualquer máquina;
- histórico versionado;
- o catálogo inicial também é uma migração;
- alterações futuras entram como `V3`, `V4` etc., sem editar migrações aplicadas.

### 5.3 JWT stateless

A API não usa sessão em memória nem cookie. O token carrega o id do usuário e é validado a cada requisição.

- Algoritmo: HMAC-SHA com chave simétrica.
- Validade: 168 horas (7 dias).
- Subject: UUID do usuário.
- Claims auxiliares: e-mail e nome.
- Rotas públicas: `/api/auth/**`, `/api/catalog` e `/api/health`.
- Demais rotas exigem token válido.

O token é a única informação de sessão no navegador. Não há conta, progresso ou preferência no `localStorage`.

### 5.4 BCrypt para senhas

As senhas são armazenadas como hash BCrypt, com salt automático. A API nunca devolve o hash e compara credenciais com `PasswordEncoder.matches`.

### 5.5 Conta demo com senha real

A conta demo deixou de aceitar qualquer senha. Credenciais:

```text
E-mail: marina@digitacourse.com
Senha:  demo1234
```

O botão **Entrar com conta de demonstração** continua disponível e usa `POST /api/auth/demo`, sem exigir digitação.

### 5.6 Seed idempotente

`DemoDataInitializer` executa no startup e chama `ensureDemoAccount()`:

- se a conta não existe, cria usuário, preferências, tentativas, lições e notificações;
- se já existe, garante apenas as preferências ausentes;
- não sobrescreve o progresso atual a cada reinício.

A restauração explícita (`POST /api/auth/demo/restore` ou ação no perfil) é diferente: apaga os dados da demo e recria o estado documentado.

### 5.7 Respostas com snapshot da conta

As operações que alteram a conta devolvem o `AccountView` completo, e não apenas o registro alterado.

Isso reduz roundtrips e mantém o front-end simples: após login, tentativa, perfil, reset ou leitura de notificação, o `AppContext` substitui o estado por um snapshot consistente.

### 5.8 Métricas derivadas continuam no front-end

O banco guarda os dados brutos: tentativas, lições concluídas, preferências e notificações. Estatísticas, nível, sequência, desafios, conquistas, heatmap e ranking continuam sendo calculados em `src/lib/metrics.js` a partir desses dados.

Vantagens:

- menos dados duplicados no banco;
- regras de apresentação evoluem sem migração;
- o motor de digitação continua responsivo.

Limitação: dois clientes abertos podem calcular visões ligeiramente diferentes até recarregarem. Para esta etapa single-user, o comportamento é aceitável.

### 5.9 Catálogo com fallback no front-end

`GET /api/catalog` é a fonte principal. O arquivo `frontend/src/data/courses.js` permanece como fallback para a landing page e para o modo offline, além de alimentar `allLessons` nas métricas.

A área autenticada depende da API para login e persistência; o fallback não substitui o banco.

### 5.10 Migração das chaves antigas

Ao carregar o cliente HTTP, o front-end remove:

- `digitacourse:accounts:v1`;
- `digitacourse:session:v1`.

Essas chaves pertenciam à simulação da Etapa 02 e não são mais lidas. A limpeza evita dados obsoletos no navegador de quem acompanhou a etapa anterior.

---

## 6. Banco de dados

### 6.1 Migrações

| Arquivo | Conteúdo |
| --- | --- |
| `V1__schema.sql` | Tabelas, chaves, índices, constraints e relacionamentos |
| `V2__seed_catalog.sql` | Três trilhas, seis módulos e doze lições |

As migrações são aplicadas automaticamente na inicialização. O Hibernate apenas valida o schema.

### 6.2 Tabelas

| Tabela | Chave | Principais campos | Regras |
| --- | --- | --- | --- |
| `users` | `id uuid` | `name`, `email`, `password_hash`, `role`, `joined_at` | `email` único; papel padrão `Aluno` |
| `user_preferences` | `user_id uuid` | `daily_goal_minutes`, `public_profile`, `email_reminders`, `weekly_summary` | FK para `users`; meta entre 1 e 120 |
| `courses` | `id varchar(50)` | `title`, `short_title`, `description`, `level`, `tone`, `duration`, `focus`, `sort_order` | Catálogo global |
| `course_modules` | `id varchar(50)` | `course_id`, `title`, `sort_order` | FK para `courses` |
| `lessons` | `id varchar(50)` | `module_id`, `title`, `description`, `duration`, `xp`, `focus`, `lesson_text`, `sort_order` | FK para `course_modules` |
| `attempts` | `id uuid` | `user_id`, `lesson_id`, `wpm`, `accuracy`, `duration_seconds`, `characters`, `errors`, `xp`, `created_at` | WPM 0–400; precisão 0–100; duração ≥ 1 |
| `completed_lessons` | `id uuid` | `user_id`, `lesson_id`, `completed_at` | Único por (`user_id`, `lesson_id`) |
| `notifications` | `id uuid` | `user_id`, `title`, `message`, `kind`, `href`, `is_read`, `created_at` | Histórico por usuário |
| `flyway_schema_history` | — | Controle interno | Criada pelo Flyway |

### 6.3 Relacionamentos

```text
users 1 ─── 1 user_preferences
users 1 ─── N attempts
users 1 ─── N completed_lessons
users 1 ─── N notifications

courses 1 ─── N course_modules
course_modules 1 ─── N lessons

lessons 1 ─── N attempts
lessons 1 ─── N completed_lessons
```

Todas as chaves estrangeiras usam `on delete cascade` para que a remoção de uma conta ou lição não deixe registros órfãos.

### 6.4 Índices

- `attempts(user_id, created_at desc)` para histórico e gráficos.
- `completed_lessons(user_id)` para progresso.
- `notifications(user_id, created_at desc)` para a central de avisos.
- `course_modules(course_id)` e `lessons(module_id)` para montar o catálogo.

### 6.5 Precisão e tempo

- Precisão: `numeric(4,1)`, arredondada para uma casa decimal.
- Datas: `timestamptz` no PostgreSQL, mapeadas como `Instant` no Java.
- Hibernate configurado com `hibernate.jdbc.time_zone: UTC`.
- O front-end formata as datas no fuso local do navegador.

---

## 7. API

Base local: `http://127.0.0.1:8080/api`.

### 7.1 Endpoints

| Método | Rota | Acesso | Resposta | Função |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | Pública | `200` | Testa a conexão com o banco |
| `GET` | `/catalog` | Pública | `200` | Trilhas, módulos e lições |
| `POST` | `/auth/login` | Pública | `200` | Login com e-mail e senha |
| `POST` | `/auth/signup` | Pública | `201` | Cadastro de nova conta |
| `POST` | `/auth/demo` | Pública | `200` | Login na conta demo |
| `POST` | `/auth/demo/restore` | Pública¹ | `200` | Restaura a demo ao estado original |
| `GET` | `/me` | JWT | `200` | Conta completa |
| `PATCH` | `/me` | JWT | `200` | Nome e preferências |
| `POST` | `/me/reset-progress` | JWT | `200` | Apaga tentativas e conclusões |
| `POST` | `/lessons/{lessonId}/attempts` | JWT | `201` | Registra tentativa |
| `PATCH` | `/notifications/{id}/read` | JWT | `200` | Marca uma notificação como lida |
| `PATCH` | `/notifications/read-all` | JWT | `200` | Marca todas como lidas |

¹ Atalho de desenvolvimento. Em produção, deve ser protegido, restrito ou removido.

### 7.2 Formato da conta

```json
{
  "user": {
    "id": "7a1c...",
    "name": "Marina Costa",
    "email": "marina@digitacourse.com",
    "role": "Aluno",
    "joinedAt": "2026-09-18T12:00:00Z"
  },
  "prefs": {
    "dailyGoalMinutes": 10,
    "publicProfile": true,
    "emailReminders": true,
    "weeklySummary": true
  },
  "completedLessons": ["fund-01", "fund-02", "fund-03", "fund-04", "dia-01", "dia-02"],
  "attempts": [
    {
      "id": "e4b2...",
      "lessonId": "dia-02",
      "lessonTitle": "Acentuação",
      "courseId": "dia-a-dia",
      "courseTitle": "Palavras do dia a dia",
      "wpm": 68,
      "accuracy": 98.6,
      "durationSeconds": 340,
      "characters": 72,
      "errors": 1,
      "xp": 75,
      "createdAt": "2026-11-21T17:00:00Z"
    }
  ],
  "notifications": [
    {
      "id": "b1d9...",
      "title": "Meta diária concluída",
      "message": "Você já praticou 13 minutos hoje. Continue assim!",
      "kind": "goal",
      "href": "/app/progresso",
      "read": false,
      "createdAt": "2026-11-21T15:00:00Z"
    }
  ]
}
```

O login e o cadastro devolvem:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "account": { "...": "snapshot da conta" }
}
```

### 7.3 Catálogo

`GET /api/catalog` devolve uma lista de trilhas com módulos e lições aninhados:

```json
[
  {
    "id": "fundamentos",
    "title": "Fundamentos do teclado",
    "shortTitle": "Fundamentos",
    "description": "Encontre a posição das mãos...",
    "level": "Iniciante",
    "tone": "mint",
    "duration": 18,
    "focus": "Postura e home row",
    "modules": [
      {
        "id": "fundamentos-1",
        "title": "Primeiros passos",
        "lessons": [
          {
            "id": "fund-01",
            "title": "Encontre a posição das mãos",
            "description": "Aprenda a apoiar os dedos...",
            "duration": 4,
            "xp": 40,
            "focus": "Home row",
            "text": "asdf jkl; asdf jkl; f j f j..."
          }
        ]
      }
    ]
  }
]
```

### 7.4 Registro de tentativa

Requisição:

```json
{
  "wpm": 65,
  "accuracy": 98.4,
  "durationSeconds": 120,
  "errors": 2
}
```

Validações:

- `wpm` entre 0 e 400;
- `accuracy` entre 0 e 100;
- `durationSeconds` maior ou igual a 1;
- `errors` maior ou igual a 0;
- lição existente;
- lição anterior concluída, quando aplicável.

A API calcula:

- `characters` a partir do texto da lição;
- `xp` da lição + 10 de bônus quando a precisão é maior ou igual a 98%;
- conclusão da lição, se for a primeira vez;
- notificação de "Lição concluída" ou "Prática registrada".

### 7.5 Erros

Formato padrão:

```json
{
  "status": 409,
  "message": "Conclua a lição anterior para liberar este exercício."
}
```

| Status | Situação | Exemplo de mensagem |
| --- | --- | --- |
| `400` | Dados inválidos | `Informe um e-mail válido.` |
| `401` | Credenciais ou token inválidos | `E-mail ou senha incorretos.` |
| `401` | Sessão ausente/expirada | `Sessão expirada. Entre novamente.` |
| `404` | Lição ou notificação inexistente | `Lição não encontrada.` |
| `409` | E-mail duplicado | `Já existe uma conta com este e-mail. Faça login.` |
| `409` | Lição bloqueada | `Conclua a lição anterior para liberar este exercício.` |
| `500` | Erro inesperado | `Ocorreu um erro interno. Tente novamente.` |

O tratamento é centralizado em `ApiExceptionHandler`, com mensagens em pt-BR e log de erros inesperados no servidor.

### 7.6 Health check

```http
GET /api/health
```

```json
{
  "status": "ok",
  "database": "postgresql",
  "service": "digitacourse-api"
}
```

O endpoint executa `select 1` via `JdbcTemplate`, então também valida a conexão com o banco.

---

## 8. Autenticação e segurança

### 8.1 JWT

- Token assinado com HMAC-SHA usando `app.jwt.secret`.
- Expiração padrão de 168 horas.
- Subject com o UUID do usuário.
- Claims `email` e `name` para conveniência.
- Validação em `JwtAuthenticationFilter`, antes do `UsernamePasswordAuthenticationFilter`.
- Token inválido ou expirado não autentica a requisição; rotas protegidas retornam `401`.

### 8.2 Senhas

- BCrypt com salt automático.
- Cadastro exige senha de 6 a 72 caracteres.
- Login compara com `passwordEncoder.matches`.
- O hash nunca aparece em DTOs, logs ou respostas.

### 8.3 Rotas e sessão

- `SecurityConfig` usa `SessionCreationPolicy.STATELESS`.
- CSRF desabilitado por ser uma API stateless com token no header.
- CORS restrito a `localhost:5173`, `127.0.0.1:5173`, `localhost:4173` e `127.0.0.1:4173`.
- Métodos permitidos: `GET`, `POST`, `PATCH`, `PUT`, `DELETE` e `OPTIONS`.
- Headers permitidos: `Authorization` e `Content-Type`.
- `UserDetailsServiceAutoConfiguration` foi excluída para não criar o usuário padrão do Spring Security.

### 8.4 Token no navegador

O front-end guarda o JWT em `digitacourse:token:v1`.

- Não há cookie de sessão.
- Não há conta, progresso ou preferência no `localStorage`.
- Ao receber `401`, o cliente remove o token.
- O logout remove o token e navega para `/entrar`.
- Recarregar a página mantém a sessão enquanto o token for válido.

### 8.5 Limitações de segurança desta etapa

- JWT em `localStorage` é vulnerável a XSS; uma aplicação de produção deve avaliar cookie `HttpOnly` + CSRF ou outra estratégia.
- Não há refresh token, revogação, rotação de chave ou lista de sessões.
- Não há rate limiting, captcha ou proteção contra força bruta.
- O endpoint público de restauração da demo é um atalho local.
- A autenticação do PostgreSQL usa `trust` no ambiente de desenvolvimento, sem senha.
- A chave JWT padrão é apenas para desenvolvimento e deve ser substituída por variável de ambiente em produção.
- A API deve rodar atrás de HTTPS em produção.

---

## 9. Conta demo e seed

### 9.1 Dados criados

| Item | Valor |
| --- | --- |
| Nome | Marina Costa |
| E-mail | `marina@digitacourse.com` |
| Senha | `demo1234` |
| Papel | Aluno |
| Membro desde | 64 dias antes da criação |
| Tentativas | 21 |
| Lições concluídas | 6 de 12 |
| Sequência | 13 dias |
| Meta diária | 10 minutos |
| Notificações | 4 (2 não lidas) |

As tentativas são geradas em relação à data atual, então o painel, o heatmap e a sequência parecem recentes em qualquer apresentação.

### 9.2 Startup

`DemoDataInitializer` roda após a aplicação subir:

1. aplica as migrações Flyway;
2. valida o schema com Hibernate;
3. chama `ensureDemoAccount()`;
4. registra no log que a conta demo está disponível.

Se a conta já existe, o progresso é preservado. O seed não é destrutivo.

### 9.3 Restauração

A restauração pode ser feita:

- pelo botão **Restaurar conta demo** no perfil;
- por `POST /api/auth/demo/restore`.

O serviço:

1. garante que a conta existe;
2. apaga tentativas, lições concluídas e notificações da demo;
3. executa `flush()` após cada exclusão;
4. redefine nome, papel, data de entrada e preferências;
5. recria as 21 tentativas, as 6 lições concluídas e as 4 notificações;
6. devolve um novo token e o snapshot restaurado.

O `flush()` é necessário porque o JPA pode agendar as exclusões; sem ele, a recriação de `completed_lessons` pode violar a constraint única (`user_id`, `lesson_id`). Esse problema foi encontrado e corrigido durante a validação.

### 9.4 Catálogo

O seed do catálogo contém:

| Trilha | Nível | Módulos | Lições | Foco |
| --- | --- | --- | --- | --- |
| Fundamentos do teclado | Iniciante | 2 | 4 | Postura, home row e teclas guias |
| Palavras do dia a dia | Intermediário | 2 | 4 | Vocabulário, acentuação, números e mensagens |
| Textos com fluência | Avançado | 2 | 4 | Frases, parágrafos e ritmo |

Total: 3 trilhas, 6 módulos e 12 lições.

---

## 10. Integração com o front-end

### 10.1 Cliente HTTP

`frontend/src/lib/api.js` centraliza:

- base URL (`/api` por padrão ou `VITE_API_URL`);
- leitura, gravação e remoção do token;
- header `Authorization`;
- serialização JSON;
- `ApiError` com status e mensagem;
- remoção automática do token em `401`;
- mensagem amigável quando a API está offline.

### 10.2 Estado global

`AppContext` passou a:

- carregar o catálogo da API, com fallback para `courses.js`;
- restaurar a sessão com `GET /api/me` quando existe token;
- expor `authReady` para evitar redirecionamentos antes da validação;
- executar login, cadastro, logout, perfil, tentativa, reset e restauração de forma assíncrona;
- substituir o snapshot da conta após cada mutação;
- manter notificações ordenadas e contadores derivados;
- manter cálculos de estatísticas, desafios, conquistas, heatmap e ranking no cliente.

As ações retornam `{ ok: true }` ou `{ ok: false, error }`, permitindo que as telas exibam mensagens sem lançar exceções para a interface.

### 10.3 Telas ajustadas

| Tela | Ajuste |
| --- | --- |
| Login | Login assíncrono, botão demo assíncrono, estados de envio e erros da API |
| Cadastro | Criação real da conta, validação de duplicidade e entrada automática |
| Painel | Consome o snapshot da conta e o catálogo do banco |
| Trilhas | Catálogo da API, com fallback local |
| Detalhe da trilha | Progresso e bloqueio calculados sobre os dados persistidos |
| Prática | Registra a tentativa na API e avisa se não foi possível salvar |
| Progresso | Histórico e métricas a partir das tentativas do banco |
| Desafios | Dados derivados das tentativas persistidas |
| Conquistas | Dados derivados das tentativas e conclusões |
| Ranking | Mantém perfis fictícios e a preferência de perfil público |
| Notificações | Leitura individual e em lote pela API |
| Perfil | Nome, meta e preferências persistidos; reset e restauração assíncronos |
| Recuperação | Continua informando que o envio de e-mail não está habilitado |
| Faq / CTA | Textos atualizados para a conta real e a API |

### 10.4 Carregamento de sessão

`AppLoading` é exibido enquanto o token é validado. O componente tem:

- teclas `F` e `J` animadas;
- texto "Conectando à sua conta";
- indicação de que o progresso vem do banco;
- respeito a `prefers-reduced-motion`.

### 10.5 O que saiu do navegador

- Contas simuladas.
- Senhas (que nem eram armazenadas).
- Progresso, tentativas e lições concluídas.
- Preferências.
- Notificações.
- Sessão por `userId`.

Permanece apenas o JWT. As chaves antigas da Etapa 02 são removidas automaticamente.

---

## 11. Estrutura criada

```text
backend/
├── pom.xml
└── src/main/
    ├── java/com/digitacourse/api/
    │   ├── DigitaCourseApplication.java
    │   ├── config/
    │   │   ├── DemoDataInitializer.java
    │   │   └── SecurityConfig.java
    │   ├── domain/
    │   │   ├── Attempt.java
    │   │   ├── CompletedLesson.java
    │   │   ├── Course.java
    │   │   ├── CourseModule.java
    │   │   ├── Lesson.java
    │   │   ├── Notification.java
    │   │   ├── UserAccount.java
    │   │   └── UserPreferences.java
    │   ├── repository/
    │   │   ├── AttemptRepository.java
    │   │   ├── CompletedLessonRepository.java
    │   │   ├── CourseModuleRepository.java
    │   │   ├── CourseRepository.java
    │   │   ├── LessonRepository.java
    │   │   ├── NotificationRepository.java
    │   │   ├── UserPreferencesRepository.java
    │   │   └── UserRepository.java
    │   ├── security/
    │   │   ├── AuthenticatedUser.java
    │   │   ├── JwtAuthenticationFilter.java
    │   │   └── JwtService.java
    │   ├── service/
    │   │   ├── AccountService.java
    │   │   ├── AuthService.java
    │   │   ├── CatalogService.java
    │   │   └── DemoDataService.java
    │   └── web/
    │       ├── ApiException.java
    │       ├── ApiExceptionHandler.java
    │       ├── AuthController.java
    │       ├── CatalogController.java
    │       ├── HealthController.java
    │       ├── LessonController.java
    │       ├── MeController.java
    │       ├── NotificationController.java
    │       └── dto/
    │           ├── AccountView.java
    │           ├── AttemptRequest.java
    │           ├── AuthResponse.java
    │           ├── CourseView.java
    │           ├── LoginRequest.java
    │           ├── ProfileUpdateRequest.java
    │           └── SignupRequest.java
    └── resources/
        ├── application.yml
        └── db/migration/
            ├── V1__schema.sql
            └── V2__seed_catalog.sql

frontend/src/
├── components/app/AppLoading.jsx    # Carregamento da sessão
├── context/AppContext.jsx           # Estado integrado à API
├── data/demo.js                     # E-mail da conta demo
├── data/courses.js                  # Catálogo fallback
├── lib/api.js                       # Cliente HTTP e token
├── lib/metrics.js                   # Métricas derivadas
├── pages/auth/LoginPage.jsx         # Login assíncrono
├── pages/auth/SignupPage.jsx        # Cadastro assíncrono
├── pages/app/ProfilePage.jsx        # Perfil, reset e restauração
├── pages/PracticePage.jsx           # Tentativa persistida
└── vite.config.js                   # Proxy /api
```

---

## 12. Telas e registros visuais

As telas mantêm o design da Etapa 02. As mudanças são comportamentais: autenticação real, persistência, estados de carregamento, botões desabilitados durante envios e textos atualizados.

**Login — autenticação real e conta demo**

![Tela de login](../assets/etapa-03/01-login.png)

**Cadastro — nova conta persistida no PostgreSQL**

![Tela de cadastro](../assets/etapa-03/02-cadastro.png)

**Painel do aluno — dados carregados da API**

![Painel do aluno](../assets/etapa-03/03-dashboard.png)

**Persistência — painel após recarregar a página**

![Painel após recarregar](../assets/etapa-03/04-persistencia-reload.png)

**Painel em mobile**

![Painel em mobile](../assets/etapa-03/05-dashboard-mobile.png)

**Trilhas — catálogo servido pelo banco**

![Catálogo de trilhas](../assets/etapa-03/06-trilhas.png)

**Detalhe da trilha — lições concluídas e bloqueadas**

![Detalhe da trilha](../assets/etapa-03/07-trilha-fundamentos.png)

**Prática em modo focado**

![Prática de digitação](../assets/etapa-03/08-pratica.png)

**Resultado — tentativa persistida e notificação gerada**

![Resultado da prática](../assets/etapa-03/09-resultado-pratica.png)

**Progresso — histórico vindo do banco**

![Página de progresso](../assets/etapa-03/10-progresso.png)

**Conquistas**

![Página de conquistas](../assets/etapa-03/11-conquistas.png)

**Desafios**

![Página de desafios](../assets/etapa-03/12-desafios.png)

**Ranking**

![Ranking](../assets/etapa-03/13-ranking.png)

**Notificações — leitura persistida**

![Central de notificações](../assets/etapa-03/14-notificacoes.png)

**Perfil e ajustes**

![Perfil e ajustes](../assets/etapa-03/15-perfil.png)

**Preferências após recarregar — meta de 15 minutos**

![Perfil com preferências persistidas](../assets/etapa-03/16-perfil-persistido.png)

**Nova conta criada pela interface**

![Dashboard de uma nova conta](../assets/etapa-03/17-novo-cadastro.png)

---

## 13. Validações realizadas

### 13.1 Build do backend

- [x] `mvn -B -DskipTests package` concluído com `BUILD SUCCESS`.
- [x] 41 arquivos Java compilados.
- [x] JAR gerado em `backend/target/digitacourse-api-0.3.0.jar`.
- [x] Aplicação iniciada e conectada ao PostgreSQL 17.6.
- [x] Flyway aplicou `V1` e `V2`.
- [x] Hibernate validou o schema com `ddl-auto: validate`.

### 13.2 Validação automatizada da API

Script HTTP executado contra a API real, com PostgreSQL: **25 de 25 verificações aprovadas**.

Cobertura:

- [x] Health check retorna `ok`.
- [x] Catálogo tem 3 trilhas e 12 lições.
- [x] Login inválido retorna `401`.
- [x] Login demo com `demo1234` retorna token.
- [x] Demo tem 21 tentativas.
- [x] Demo tem 6 lições concluídas.
- [x] Demo tem 4 notificações.
- [x] Demo tem preferências.
- [x] `GET /me` restaura a sessão.
- [x] Rota protegida sem token retorna `401`.
- [x] Cadastro cria sessão.
- [x] Cadastro cria notificação de boas-vindas.
- [x] Cadastro duplicado retorna `409`.
- [x] Tentativa é persistida.
- [x] Tentativa conclui a lição.
- [x] Tentativa gera XP com bônus de precisão.
- [x] Tentativa gera notificação.
- [x] Lição bloqueada retorna `409`.
- [x] Perfil e preferências são atualizados.
- [x] Alterações sobrevivem a uma nova requisição.
- [x] Notificação é marcada como lida.
- [x] Reset limpa tentativas e conclusões.
- [x] Reset registra notificação.
- [x] Restauração da demo volta às 21 tentativas.
- [x] Demo restaurada persiste após nova consulta.

### 13.3 Validação automatizada da interface

Chrome headless via CDP, viewport 1440×1000 e 390×844: **27 de 27 verificações aprovadas**, sem erros de console e sem respostas HTTP inesperadas.

Cobertura:

- [x] Login público carrega.
- [x] Cadastro público carrega.
- [x] Login demo pela interface entra na área do aluno.
- [x] Painel mostra Marina.
- [x] JWT é armazenado no navegador.
- [x] Apenas o token fica no `localStorage`.
- [x] Nenhuma conta ou progresso fica no `localStorage`.
- [x] API entrega 21 tentativas.
- [x] API entrega 6 lições concluídas.
- [x] API entrega 4 notificações.
- [x] Painel renderiza dados do banco.
- [x] Recarregar mantém sessão e dados.
- [x] Trilhas usam o catálogo do banco.
- [x] Detalhe da trilha mostra lições concluídas.
- [x] Prática concluída mostra resultado.
- [x] Tentativa feita pela UI é persistida.
- [x] Prática gera notificação.
- [x] Histórico mostra a tentativa recém-criada.
- [x] Notificação aparece na lista.
- [x] Preferências são salvas pela interface.
- [x] Meta diária sobrevive ao recarregar.
- [x] Meta atualizada no PostgreSQL.
- [x] Logout remove a sessão e volta ao login.
- [x] Cadastro pela interface cria conta e sessão.
- [x] Demo é restaurada ao estado original.
- [x] Sem erros de console.
- [x] Sem respostas HTTP de erro na interface.

### 13.4 Build do front-end

Resultado final de `npm run build`:

| Artefato | Tamanho | Gzip |
| --- | --- | --- |
| JavaScript | 347,75 KB | 98,74 KB |
| CSS | 156,46 KB | 29,21 KB |
| HTML | 2,00 KB | 0,67 KB |

- 81 módulos transformados.
- Fontes continuam self-hosted.
- Nenhuma biblioteca de gráficos, ícones ou estado foi adicionada.

### 13.5 Revisão visual

- [x] Login e cadastro.
- [x] Painel em desktop e mobile.
- [x] Trilhas e detalhe da trilha.
- [x] Prática e resultado.
- [x] Progresso, conquistas, desafios e ranking.
- [x] Notificações.
- [x] Perfil e preferências persistidas.
- [x] Nova conta criada pela interface.

### 13.6 Correções aplicadas durante a validação

| Problema | Correção |
| --- | --- |
| Restauração da demo falhava com `duplicate key value violates unique constraint "completed_lessons_unique"` | `flush()` após cada exclusão antes de recriar os dados |
| Spring Security gerava um usuário padrão e uma senha aleatória no log | Exclusão de `UserDetailsServiceAutoConfiguration` |
| Logout chegava a `/entrar` mesmo com `navigate('/')` no handler | Redirecionamento explícito para `/entrar` |
| Chaves antigas da Etapa 02 permaneciam no navegador | Remoção automática de `digitacourse:accounts:v1` e `digitacourse:session:v1` |
| Asserções de texto falhavam porque o CSS aplica `text-transform: uppercase` | Verificações passaram a comparar texto em minúsculas |
| Contas temporárias de teste ficavam no banco | Exclusão via `psql` após a validação |

### 13.7 Estado final do banco

Após a validação, contas temporárias foram removidas e a demo foi restaurada:

```text
marina@digitacourse.com | 21 tentativas | 6 lições | 4 notificações | meta 10 min
```

---

## 14. Como executar

### 14.1 Requisitos

| Ferramenta | Versão usada |
| --- | --- |
| Java | Temurin 21.0.13.1+2 |
| Maven | 3.9.16 |
| PostgreSQL | 17.6 |
| Node.js | 24.14.0 (requisito mínimo: 20) |
| npm | Incluído com o Node |

As ferramentas podem ser portáteis; não é necessário instalar serviços ou usar privilégios de administrador.

### 14.2 PostgreSQL

Criar o cluster local (apenas na primeira vez):

```bash
initdb -D pgdata -U postgres --auth=trust --encoding=UTF8
```

Iniciar:

```bash
pg_ctl -D pgdata -l pgdata.log -o "-p 5432" start
```

Criar o banco:

```bash
createdb -h 127.0.0.1 -p 5432 -U postgres digitacourse
```

> `--auth=trust` é adequado somente para desenvolvimento local. Em produção, use senha forte, TLS e usuário com privilégios mínimos.

### 14.3 Backend

```bash
cd backend
mvn spring-boot:run
```

Ou gerar o JAR e executar:

```bash
mvn -B -DskipTests package
java -jar target/digitacourse-api-0.3.0.jar
```

A API sobe em `http://127.0.0.1:8080/api`.

Health check:

```bash
curl http://127.0.0.1:8080/api/health
```

### 14.4 Front-end

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`.

O Vite faz proxy de `/api` para `http://127.0.0.1:8080`. Para apontar para outra API:

```bash
VITE_API_URL=https://api.exemplo.com/api npm run dev
```

> **Windows/PowerShell:** use `npm.cmd` caso `npm.ps1` esteja bloqueado pela política de scripts.

### 14.5 Variáveis de ambiente

| Variável | Padrão | Função |
| --- | --- | --- |
| `DIGITACOURSE_DB_URL` | `jdbc:postgresql://127.0.0.1:5432/digitacourse` | URL JDBC |
| `DIGITACOURSE_DB_USER` | `postgres` | Usuário do banco |
| `DIGITACOURSE_DB_PASSWORD` | vazio | Senha do banco |
| `DIGITACOURSE_JWT_SECRET` | Chave local de desenvolvimento | Assinatura do JWT |
| `PORT` | `8080` | Porta da API |
| `VITE_API_URL` | `/api` | Base da API no front-end |

Em produção, `DIGITACOURSE_JWT_SECRET` deve ter pelo menos 32 caracteres e ser mantido fora do repositório.

### 14.6 Conta demo

```text
E-mail: marina@digitacourse.com
Senha:  demo1234
```

Também é possível usar o botão **Entrar com conta de demonstração**.

Restaurar o estado original:

```bash
curl -X POST http://127.0.0.1:8080/api/auth/demo/restore
```

Ou usar **Perfil → Restaurar conta demo**.

### 14.7 Recriar o banco do zero

> Isto apaga todos os usuários e progressos.

```bash
dropdb -h 127.0.0.1 -p 5432 -U postgres digitacourse
createdb -h 127.0.0.1 -p 5432 -U postgres digitacourse
```

Reinicie a API para o Flyway aplicar as migrações e recriar o catálogo e a demo.

### 14.8 Roteiro rápido de verificação

1. Abrir `/entrar` e entrar com a conta demo.
2. Conferir o painel com 21 tentativas e 6 lições concluídas.
3. Recarregar a página e confirmar que a sessão continua.
4. Abrir uma trilha, praticar uma lição e concluir.
5. Conferir a nova tentativa no histórico e a notificação.
6. Alterar a meta diária no perfil e recarregar.
7. Sair e confirmar o retorno para `/entrar`.
8. Criar uma conta nova e confirmar que ela começa vazia.
9. Restaurar a conta demo e confirmar os 21 registros.
10. Testar o layout em 390 px.

---

## 15. Limitações e provisões

| Limitação atual | Provisão para as próximas etapas |
| --- | --- |
| Endpoint de restauração da demo é público | Proteger, restringir por ambiente ou remover em produção |
| JWT em `localStorage` | Avaliar cookie `HttpOnly` + CSRF ou outra estratégia |
| Sem refresh token ou revogação | Implementar rotação, expiração curta e lista de sessões |
| Sem rate limiting ou captcha | Adicionar proteção contra força bruta |
| Sem verificação de e-mail | Integrar serviço de e-mail e confirmação de conta |
| Recuperação de senha sem envio real | Criar token de redefinição com validade e e-mail |
| Sem exclusão de conta ou troca de e-mail | Definir fluxo seguro de identidade |
| Ranking fictício e calculado no cliente | Criar ranking real com regras, moderação e anti-fraude |
| Métricas derivadas no cliente | Avaliar cache/consulta no servidor quando houver muitos dados |
| Seed do catálogo via migração | Criar área administrativa ou importação controlada |
| Sem testes versionados no repositório | Adicionar testes JUnit/MockMvc e testes de componentes |
| Sem lint/formatador | Configurar ESLint/Prettier |
| Sem auditoria de acessibilidade | Rodar axe/Lighthouse e testes com leitor de tela |
| Sem deploy, HTTPS ou CI | Configurar ambiente de produção e pipeline |
| PostgreSQL local com `trust` | Endurecer autenticação e credenciais |
| Sem área administrativa | Planejar gestão de alunos, trilhas e relatórios |

---

## 16. Próximos passos

1. Validar a Etapa 03 com o orientador.
2. Proteger o endpoint de restauração da demo e remover a chave JWT padrão do ambiente de produção.
3. Adicionar verificação de e-mail e recuperação de senha real.
4. Implementar refresh token e revogação de sessão.
5. Adicionar rate limiting e proteção contra força bruta.
6. Versionar testes de API e de interface no repositório.
7. Configurar lint, formatador e auditoria de acessibilidade.
8. Implementar ranking real e notificações por e-mail.
9. Planejar a área administrativa em etapa própria.
10. Configurar deploy com HTTPS, variáveis seguras e fallback de SPA.

---

## 17. Arquivos entregues

| Arquivo | Função |
| --- | --- |
| `backend/pom.xml` | Dependências e build Maven |
| `backend/src/main/resources/application.yml` | Banco, JPA, Flyway, JWT, CORS e porta |
| `backend/src/main/resources/db/migration/V1__schema.sql` | Schema relacional |
| `backend/src/main/resources/db/migration/V2__seed_catalog.sql` | Catálogo inicial |
| `backend/src/main/java/.../config/SecurityConfig.java` | Segurança stateless, CORS e BCrypt |
| `backend/src/main/java/.../config/DemoDataInitializer.java` | Seed da demo no startup |
| `backend/src/main/java/.../security/JwtService.java` | Emissão e leitura do JWT |
| `backend/src/main/java/.../security/JwtAuthenticationFilter.java` | Autenticação por bearer token |
| `backend/src/main/java/.../service/AuthService.java` | Login, cadastro, demo e restauração |
| `backend/src/main/java/.../service/AccountService.java` | Conta, perfil, tentativas e notificações |
| `backend/src/main/java/.../service/CatalogService.java` | Montagem do catálogo |
| `backend/src/main/java/.../service/DemoDataService.java` | Seed e restauração da demo |
| `backend/src/main/java/.../web/*` | Controllers, DTOs, erros e health check |
| `backend/src/main/java/.../domain/*` | Entidades JPA |
| `backend/src/main/java/.../repository/*` | Repositórios Spring Data |
| `frontend/src/lib/api.js` | Cliente HTTP, token e limpeza legada |
| `frontend/src/context/AppContext.jsx` | Estado global integrado à API |
| `frontend/src/components/app/AppLoading.jsx` | Carregamento da sessão |
| `frontend/src/data/demo.js` | E-mail da conta demo |
| `frontend/src/pages/auth/LoginPage.jsx` | Login real e demo assíncrona |
| `frontend/src/pages/auth/SignupPage.jsx` | Cadastro real |
| `frontend/src/pages/app/ProfilePage.jsx` | Perfil, reset e restauração |
| `frontend/src/pages/PracticePage.jsx` | Persistência de tentativas |
| `frontend/src/pages/app/ProgressPage.jsx` | Textos atualizados |
| `frontend/src/pages/app/ChallengesPage.jsx` | Textos atualizados |
| `frontend/src/pages/app/NotificationsPage.jsx` | Textos e leitura persistida |
| `frontend/src/components/app/Sidebar.jsx` | Identidade da conta |
| `frontend/src/components/Faq.jsx` | FAQ atualizado |
| `frontend/src/components/FinalCta.jsx` | CTA atualizado |
| `frontend/src/pages/auth/ForgotPasswordPage.jsx` | Texto de recuperação atualizado |
| `frontend/vite.config.js` | Proxy `/api` |
| `README.md` | Status, stack e execução atualizados |
| `docs/README.md` | Índice atualizado |
| `docs/assets/etapa-03/*` | Dezessete capturas da etapa |

---

## 18. Critérios de aceite

- [x] A API Spring Boot inicia e conecta ao PostgreSQL.
- [x] O Flyway aplica o schema e o catálogo sem intervenção manual.
- [x] O Hibernate valida o schema.
- [x] O health check confirma a conexão com o banco.
- [x] O catálogo com 3 trilhas e 12 lições vem do PostgreSQL.
- [x] O cadastro cria uma conta real com senha BCrypt.
- [x] O login valida a senha e devolve um JWT.
- [x] E-mails duplicados são rejeitados com `409`.
- [x] Rotas protegidas exigem token válido.
- [x] A conta demo entra com `demo1234`.
- [x] A demo tem 21 tentativas, 6 lições, 4 notificações e meta de 10 minutos.
- [x] Tentativas são persistidas e atualizam o progresso.
- [x] Lições são liberadas em sequência.
- [x] Precisão maior ou igual a 98% concede bônus de XP.
- [x] Notificações são criadas, lidas e limitadas a 30 por conta.
- [x] Nome, meta e preferências são persistidos.
- [x] Redefinir progresso limpa tentativas e conclusões.
- [x] Restaurar a demo recria o estado documentado.
- [x] Recarregar a página mantém a sessão.
- [x] Apenas o token fica no `localStorage`.
- [x] As chaves antigas da Etapa 02 são removidas.
- [x] A interface preserva o design e a responsividade.
- [x] O build do backend conclui sem erros.
- [x] O build do front-end conclui sem erros.
- [x] As 25 verificações da API passam.
- [x] As 27 verificações da interface passam.
- [x] A documentação da etapa está registrada neste arquivo.
