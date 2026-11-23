# DigitaCourse API

API Spring Boot do DigitaCourse. Persiste contas, catálogo, tentativas, progresso, preferências e notificações no PostgreSQL, com autenticação JWT e senhas BCrypt.

A documentação da etapa está em [`docs/etapas/etapa-03-banco-de-dados.md`](../docs/etapas/etapa-03-banco-de-dados.md). A evolução pós-Etapa 03 está no [roadmap de 20 entregas](../docs/entregas/README.md), com a [Entrega 01](../docs/entregas/entrega-01-testes-de-integracao.md) concluída.

## Stack

| Item | Versão |
| --- | --- |
| Java | 21 |
| Spring Boot | 3.4.5 |
| PostgreSQL | 17.6 |
| Flyway | Migrações V1 e V2 |
| Maven | 3.9+ |
| Testes | JUnit 5, Spring Boot Test, MockMvc e AssertJ |

## Banco de dados

```bash
initdb -D pgdata -U postgres --auth=trust --encoding=UTF8
pg_ctl -D pgdata -l pgdata.log -o "-p 5432" start
createdb -h 127.0.0.1 -p 5432 -U postgres digitacourse
```

O schema e o catálogo são aplicados automaticamente pelo Flyway na inicialização.

## Executar

```bash
mvn spring-boot:run
```

Ou:

```bash
mvn -B -DskipTests package
java -jar target/digitacourse-api-0.3.0.jar
```

A API sobe em `http://127.0.0.1:8080/api`.

```bash
curl http://127.0.0.1:8080/api/health
```

## Testes de integração

A suíte usa Spring Boot Test, MockMvc e um PostgreSQL real no banco dedicado `digitacourse_test`. Ela cobre saúde, catálogo, autenticação, cadastro, sessão JWT, perfil, tentativas, bloqueio sequencial, bônus de XP, reset, restauração da demo e notificações.

Na primeira execução, crie o banco:

```bash
createdb -h 127.0.0.1 -p 5432 -U postgres digitacourse_test
```

Depois execute:

```bash
mvn -B test
```

Resultado esperado: **24 testes, zero falhas**.

O perfil `test` aplica as migrações Flyway, restaura a demo antes de cada teste e remove os usuários criados pela suíte. Antes de qualquer limpeza, o teste confere se o banco atual é `digitacourse_test`; assim, o banco de desenvolvimento `digitacourse` não é alterado.

As variáveis opcionais são:

| Variável | Padrão |
| --- | --- |
| `DIGITACOURSE_TEST_DB_URL` | `jdbc:postgresql://127.0.0.1:5432/digitacourse_test` |
| `DIGITACOURSE_TEST_DB_USER` | `postgres` |
| `DIGITACOURSE_TEST_DB_PASSWORD` | vazio |
| `DIGITACOURSE_TEST_JWT_SECRET` | Chave exclusiva de teste com 32+ caracteres |

Detalhes da entrega: [`docs/entregas/entrega-01-testes-de-integracao.md`](../docs/entregas/entrega-01-testes-de-integracao.md).

## Variáveis de ambiente

| Variável | Padrão |
| --- | --- |
| `DIGITACOURSE_DB_URL` | `jdbc:postgresql://127.0.0.1:5432/digitacourse` |
| `DIGITACOURSE_DB_USER` | `postgres` |
| `DIGITACOURSE_DB_PASSWORD` | vazio |
| `DIGITACOURSE_JWT_SECRET` | Chave local de desenvolvimento |
| `PORT` | `8080` |

Em produção, use uma chave JWT forte (32+ caracteres), senha no banco e HTTPS.

## Endpoints

| Método | Rota | Acesso |
| --- | --- | --- |
| `GET` | `/api/health` | Pública |
| `GET` | `/api/catalog` | Pública |
| `POST` | `/api/auth/login` | Pública |
| `POST` | `/api/auth/signup` | Pública |
| `POST` | `/api/auth/demo` | Pública |
| `POST` | `/api/auth/demo/restore` | Pública (atalho de desenvolvimento) |
| `GET` | `/api/me` | JWT |
| `PATCH` | `/api/me` | JWT |
| `POST` | `/api/me/reset-progress` | JWT |
| `POST` | `/api/lessons/{lessonId}/attempts` | JWT |
| `PATCH` | `/api/notifications/{id}/read` | JWT |
| `PATCH` | `/api/notifications/read-all` | JWT |

As rotas protegidas esperam `Authorization: Bearer <token>`.

## Conta demo

```text
E-mail: marina@digitacourse.com
Senha:  demo1234
```

A demo é criada no startup de forma idempotente e pode ser restaurada para 21 tentativas, 6 lições concluídas e 4 notificações:

```bash
curl -X POST http://127.0.0.1:8080/api/auth/demo/restore
```

## Migrações

```text
src/main/resources/db/migration/
├── V1__schema.sql
└── V2__seed_catalog.sql
```

Nunca edite uma migração já aplicada. Crie `V3__descricao.sql`, `V4__descricao.sql` etc.

## Estrutura

```text
src/
├── main/
│   ├── java/com/digitacourse/api/
│   │   ├── config/       # Segurança e seed da demo
│   │   ├── domain/       # Entidades JPA
│   │   ├── repository/   # Spring Data
│   │   ├── security/     # JWT e principal
│   │   ├── service/      # Regras de negócio
│   │   └── web/          # Controllers, DTOs e erros
│   └── resources/
│       ├── application.yml
│       └── db/migration/ # Flyway V1 e V2
└── test/
    ├── java/com/digitacourse/api/        # Testes de integração
    │   └── support/                      # Base, limpeza e guarda de banco
    └── resources/application-test.yml    # Banco digitacourse_test
```

## Limites desta etapa

- Restauração pública da demo apenas para desenvolvimento.
- Sem refresh token, revogação, rate limiting ou verificação de e-mail.
- Sem área administrativa.
- JWT no `localStorage` do front-end.
- Sem CI, testes de front-end, lint ou cobertura mínima.
- O roadmap completo está em [`docs/entregas/README.md`](../docs/entregas/README.md).
