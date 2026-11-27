# Entregas de evolução — DigitaCourse

| Campo | Valor |
| --- | --- |
| **Status** | Roadmap ativo — Entrega 04 concluída localmente |
| **Data** | 26–27/11/2026 |
| **Base** | Etapa 03 — API Spring Boot + PostgreSQL |
| **Escopo** | 20 entregas de evolução de código e software |
| **Idioma** | Português (pt-BR) |

---

## 1. Como usar este documento

Este é o documento mestre da evolução do DigitaCourse depois da Etapa 03. Ele registra a análise dos gaps atuais e divide o trabalho restante em **20 entregas**.

Regras de condução:

- As entregas serão implementadas **somente quando solicitadas**.
- Cada entrega implementada ganha um documento próprio nesta pasta, com escopo, decisões, arquivos, validações e critérios de aceite.
- O status deste roadmap é atualizado a cada entrega concluída.
- A ordem recomendada respeita dependências técnicas, mas o usuário pode antecipar qualquer entrega.
- A identidade visual, a experiência em pt-BR e os fluxos já validados devem ser preservados.
- A área administrativa e o envio real de e-mail agora fazem parte do roadmap, mas continuam **não implementados** nesta rodada.

Legenda de status:

| Status | Significado |
| --- | --- |
| **Concluída** | Implementada, validada e documentada |
| **Concluída localmente** | Implementada e validada no ambiente local; a etapa remota depende de publicação |
| **Planejada** | Especificada, aguardando solicitação |
| **Em andamento** | Sendo implementada na rodada atual |

---

## 2. Análise do estado atual

### 2.1 O que já está pronto

- Landing page responsiva, acessível e em pt-BR.
- Cadastro, login, conta demo e sessão JWT com senhas BCrypt.
- Catálogo de 3 trilhas, 6 módulos e 12 lições no PostgreSQL.
- Painel, prática, progresso, desafios, conquistas, ranking, notificações e perfil.
- API Spring Boot em camadas, com Flyway, validação, CORS e tratamento centralizado de erros.
- Persistência de contas, preferências, tentativas, lições concluídas e notificações.
- Seed idempotente e restauração da conta demo.
- 25 verificações manuais de API e 27 verificações de interface aprovadas na Etapa 03.
- Build de backend e front-end aprovados.
- **Entrega 01:** 24 testes de integração versionados, com banco PostgreSQL dedicado.
- **Entrega 02:** repositório Git em `main`, higiene de arquivos, CI de backend/front-end e guia de contribuição, validados localmente.
- **Entrega 03:** ESLint, Prettier e `.editorconfig` no front-end, baseline corrigido e lint/formatação verificados na CI.
- **Entrega 04:** 46 testes de componente com Vitest e React Testing Library, 11 testes E2E com Playwright, banco PostgreSQL dedicado e job de E2E na CI.

### 2.2 Matriz de gaps

| Dimensão | Lacuna observada | Risco ou impacto | Entregas |
| --- | --- | --- | --- |
| Testes e qualidade | Até a Etapa 03, as verificações eram scripts temporários fora do repositório e não havia `src/test` | Regressões não eram detectáveis de forma reproduzível | 01, 02, 04 |
| Versionamento e CI | Repositório e pipeline criados; execução remota e branch protection dependem de publicação | Ainda não há gate efetivo de merge no GitHub | 02 |
| Qualidade do front-end | ESLint, Prettier, testes de componente e E2E implementados; ainda não há auditoria automatizada de acessibilidade | Regressões de estilo, utilitários e fluxos críticos agora são detectadas; barreiras de acessibilidade ainda podem passar | 03, 04, 05 |
| Acessibilidade | Não há auditoria automatizada com axe nem roteiro assistivo | Barreiras de teclado, contraste e leitor de tela podem regredir | 05 |
| Contrato da API | Não há OpenAPI, versionamento formal nem testes de contrato | Front-end e futuras integrações dependem de conhecimento implícito | 06 |
| Sessão e autenticação | JWT longo no `localStorage`, sem refresh, revogação ou lista de sessões | Token vazado permanece válido por até sete dias | 07 |
| Abuso e força bruta | Não há rate limiting, backoff, captcha ou proteção no login/cadastro | Credenciais e endpoints públicos podem ser explorados | 08 |
| Identidade | Não há verificação de e-mail nem recuperação de senha real | Contas não confirmadas e usuários sem autoatendimento | 09 |
| Privacidade e conta | Não há troca de e-mail/senha, exclusão de conta ou exportação de dados | Autonomia e conformidade com LGPD ficam limitadas | 10 |
| Segredos e demo | Chave JWT padrão, senha demo exposta e restauração pública | Risco relevante se o ambiente for publicado sem ajustes | 11 |
| Observabilidade | Apenas health check; sem logs estruturados, métricas, tracing ou alertas | Falhas em produção seriam difíceis de diagnosticar | 12 |
| Empacotamento e deploy | Sem Docker, ambientes, HTTPS, fallback de SPA ou pipeline de publicação | Publicação manual e não reproduzível | 13 |
| Backup e recuperação | Sem rotina de backup, retenção ou teste de restauração | Perda de dados sem plano de recuperação | 14 |
| Leitura e escala | `AccountView` devolve todas as tentativas a cada mutação | Payload cresce sem limite e afeta desempenho | 15 |
| Autorização | O campo `role` existe, mas não há RBAC nem auditoria | Área administrativa não pode existir com segurança | 16 |
| Administração de conteúdo | Catálogo só evolui por migração SQL | Gestão de trilhas, módulos e lições exige desenvolvedor | 17 |
| Administração de alunos | Não há busca, relatórios, exportação ou moderação | Acompanhamento pedagógico e suporte ficam manuais | 18 |
| Gamificação | Ranking, sequência e conquistas são calculados no cliente; ranking é fictício | Resultados podem divergir entre clientes e não há anti-fraude | 19 |
| Comunicação | Notificações apenas dentro do app; preferências de e-mail não enviam nada | Baixo retorno e ausência de lembretes transacionais | 20 |

### 2.3 Itens fora do roadmap atual

Os itens abaixo não entram nas 20 entregas nesta fase. Podem ser avaliados depois, sem compromisso:

- aplicativo nativo iOS/Android;
- pagamentos, assinaturas ou cobrança;
- certificados com validação externa;
- SSO institucional, OAuth social ou MFA;
- colaboração em tempo real ou WebSocket;
- recursos de IA para correção ou recomendação;
- internacionalização além do pt-BR;
- PWA com modo offline avançado;
- tema escuro;
- upload de mídia e biblioteca de imagens;
- API pública para terceiros;
- marketplace de conteúdo.

### 2.4 Princípios de sequenciamento

1. **Fundação antes de escala:** testes, Git, CI, lint e E2E precisam existir antes de mudanças grandes.
2. **Segurança antes de exposição pública:** sessão, rate limiting, e-mail e segredos vêm antes do deploy em produção.
3. **Operação antes de novos módulos:** observabilidade, empacotamento e backup reduzem o custo de evoluir.
4. **Autorização antes da administração:** nenhuma tela administrativa deve nascer sem RBAC e auditoria.
5. **Leitura paginada antes de relatórios:** o histórico precisa de paginação antes de dashboards administrativos.
6. **E-mail transacional depois da identidade:** verificação e recuperação de senha fornecem a base para notificações por e-mail.
7. **Cada entrega é vertical e documentada:** código, testes, migração quando necessária, documentação e evidência de validação.

---

## 3. Visão das 20 entregas

| # | Entrega | Fase | Status | Depende de | Documento |
| --- | --- | --- | --- | --- | --- |
| 01 | Testes de integração da API e banco de teste reproduzível | Fundação e qualidade | **Concluída** | Etapa 03 | [Entrega 01](entrega-01-testes-de-integracao.md) |
| 02 | Versionamento Git, higiene e pipeline de CI | Fundação e qualidade | **Concluída localmente** | 01 | [Entrega 02](entrega-02-git-ci.md) |
| 03 | Lint, formatação e análise estática do front-end | Fundação e qualidade | **Concluída localmente** | 02 | [Entrega 03](entrega-03-lint.md) |
| 04 | Testes de componentes e E2E dos fluxos críticos | Fundação e qualidade | **Concluída localmente** | 02, 03 | [Entrega 04](entrega-04-testes.md) |
| 05 | Acessibilidade automatizada e revisão assistiva | Fundação e qualidade | Planejada | 04 | A criar |
| 06 | Contrato OpenAPI e documentação viva da API | Fundação e qualidade | Planejada | 01 | A criar |
| 07 | Endurecimento de sessão e autenticação | Segurança e identidade | Planejada | 01, 06 | A criar |
| 08 | Rate limiting e proteção contra abuso | Segurança e identidade | Planejada | 07 | A criar |
| 09 | Verificação de e-mail e recuperação de senha | Segurança e identidade | Planejada | 07, 08 | A criar |
| 10 | Gestão de conta, privacidade e LGPD | Segurança e identidade | Planejada | 07, 09 | A criar |
| 11 | Segredos, perfis de ambiente e proteção da demo | Segurança e identidade | Planejada | 07 | A criar |
| 12 | Observabilidade, logs estruturados e health operacional | Operação e confiabilidade | Planejada | 02, 11 | A criar |
| 13 | Empacotamento e publicação reproduzível | Operação e confiabilidade | Planejada | 02, 03, 04, 11, 12 | A criar |
| 14 | Backup, restauração e retenção de dados | Operação e confiabilidade | Planejada | 13 | A criar |
| 15 | Histórico paginado, resumo da conta e performance | Produto, dados e administração | Planejada | 06 | A criar |
| 16 | Papéis, autorização e auditoria de ações | Produto, dados e administração | Planejada | 07, 15 | A criar |
| 17 | Área administrativa de conteúdo | Produto, dados e administração | Planejada | 06, 16 | A criar |
| 18 | Área administrativa de alunos e relatórios | Produto, dados e administração | Planejada | 15, 16, 17 | A criar |
| 19 | Ranking real e gamificação no servidor | Produto, dados e administração | Planejada | 15, 16 | A criar |
| 20 | Notificações por e-mail e preferências de comunicação | Produto, dados e administração | Planejada | 09, 10 | A criar |

---

## 4. Fases

| Fase | Entregas | Objetivo |
| --- | --- | --- |
| **Fundação e qualidade** | 01 a 06 | Tornar o projeto reproduzível, testável, documentado e protegido por automação |
| **Segurança e identidade** | 07 a 11 | Reduzir risco de sessão, abuso, fraude de identidade e exposição de segredos |
| **Operação e confiabilidade** | 12 a 14 | Publicar, observar e recuperar o sistema com previsibilidade |
| **Produto, dados e administração** | 15 a 20 | Evoluir leitura, autorização, gestão, gamificação e comunicação |

As fases são temáticas. As dependências da tabela são mais importantes que a numeração absoluta.

---

## 5. Especificação das entregas

### Entrega 01 — Testes de integração da API e banco de teste reproduzível

| Campo | Valor |
| --- | --- |
| **Status** | Concluída em 23/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Etapa 03 |
| **Documento** | [Entrega 01](entrega-01-testes-de-integracao.md) |

**Objetivo:** transformar as verificações manuais da Etapa 03 em uma suíte versionada, determinística e executável por qualquer pessoa.

**Escopo entregue:**

- perfil `test` com PostgreSQL dedicado `digitacourse_test`;
- JUnit 5, Spring Boot Test, MockMvc e AssertJ;
- 24 testes cobrindo saúde, catálogo, autenticação, conta, tentativas, reset, restauração da demo e notificações;
- limpeza determinística antes de cada teste e restauração da demo;
- proteção que impede a suíte de limpar um banco que não seja `digitacourse_test`;
- documentação de execução e resultados.

**Fora de escopo:** testes de front-end, CI, Testcontainers, cobertura mínima e testes de carga.

**Critérios de aceite:**

- [x] `mvn test` executa a suíte usando PostgreSQL real.
- [x] Nenhum teste toca o banco de desenvolvimento `digitacourse`.
- [x] O estado da demo é restaurado antes de cada teste.
- [x] Usuários criados pelos testes são removidos.
- [x] 24 testes passam sem falhas.
- [x] O banco de desenvolvimento permanece com 1 usuário, 21 tentativas, 6 lições e 4 notificações.
- [x] A execução e as decisões estão documentadas.

---

### Entrega 02 — Versionamento Git, higiene e pipeline de CI

| Campo | Valor |
| --- | --- |
| **Status** | Concluída localmente em 24/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entrega 01 |
| **Documento** | [Entrega 02](entrega-02-git-ci.md) |

**Objetivo:** colocar o projeto sob controle de versão e executar testes e build automaticamente em cada alteração.

**Escopo entregue:**

- repositório Git inicializado em `main`, com Conventional Commits e branches curtas documentadas;
- `.gitignore` para Java/Maven, Node/Vite, IDEs, sistemas operacionais, bancos locais, logs, arquivos `.env` e ferramentas portáteis;
- `.gitattributes` para line endings, encoding e binários;
- pipeline de CI com job de backend, PostgreSQL 17 de serviço e `mvn -B test`;
- job de front-end com Node.js 22, `npm ci` e `npm run build`;
- publicação dos relatórios Surefire e do build do front-end como artefatos;
- cache de Maven e npm e cancelamento de execuções antigas;
- template de pull request e `CONTRIBUTING.md` com o fluxo de branches, PRs, checks e branch protection;
- validação local da suíte e do build com as variáveis da CI;
- documentação da entrega, dos riscos e da publicação pendente.

**Fora de escopo:** deploy, release automatizada, cobertura mínima, assinatura de commits, templates de issue e ativação da proteção da branch sem remoto GitHub.

**Critérios de aceite:**

- [x] O projeto tem histórico Git íntegro e nenhum dado local versionado.
- [x] A CI está configurada para rodar em push e pull request.
- [x] O job de backend sobe PostgreSQL e executa os 24 testes da Entrega 01.
- [x] O job de front-end instala dependências de forma limpa e gera o build.
- [ ] Falha de teste ou build bloqueia o merge — pendente de publicar o repositório e ativar a branch protection.
- [x] O fluxo está documentado no README e no `CONTRIBUTING.md`.

A implementação e as validações locais estão concluídas. O último critério depende de uma configuração remota do GitHub, registrada como passo manual na [Entrega 02](entrega-02-git-ci.md).

---

### Entrega 03 — Lint, formatação e análise estática do front-end

| Campo | Valor |
| --- | --- |
| **Status** | Concluída localmente em 25/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entrega 02 |
| **Documento** | [Entrega 03](entrega-03-lint.md) |

**Objetivo:** padronizar o código React/CSS e impedir erros comuns de hooks, imports e acessibilidade básica.

**Escopo entregue:**

- ESLint 9 em configuração flat, com regras recomendadas de JavaScript, React 18, hooks estáveis e acessibilidade JSX;
- Prettier com aspas simples, sem ponto e vírgula, vírgula final, largura 100 e LF;
- `.editorconfig` global e scripts `lint`, `lint:fix`, `format` e `format:check`;
- correção do baseline de 15 erros sem mudança visual;
- lint e `format:check` no job de front-end da CI;
- documentação dos padrões, decisões e exceções.

**Fora de escopo:** migração para TypeScript, troca de biblioteca de estilos, refatoração ampla, testes de componentes/E2E e auditoria automatizada de acessibilidade com axe.

**Critérios de aceite:**

- [x] `npm run lint` termina sem erros no código atual.
- [x] `npm run format:check` valida todos os arquivos.
- [x] A CI falha quando lint ou formatação quebram.
- [x] O fluxo de desenvolvimento está documentado.
- [x] Nenhuma regra é desativada em massa sem justificativa.

A única regra desativada manualmente é `react/prop-types`, porque o projeto usa JavaScript sem PropTypes e a validação de props não faz parte desta entrega. As regras do React Compiler do `eslint-plugin-react-hooks` v7 foram mantidas fora para não exigir refatoração de comportamento.

---

### Entrega 04 — Testes de componentes e E2E dos fluxos críticos

| Campo | Valor |
| --- | --- |
| **Status** | Concluída localmente em 26–27/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entregas 02 e 03 |
| **Documento** | [Entrega 04](entrega-04-testes.md) |

**Objetivo:** versionar testes do front-end e validar os fluxos que sustentam o produto.

**Escopo entregue:**

- Vitest, React Testing Library, `jest-dom`, `user-event` e jsdom configurados;
- 46 testes de componente e utilitários cobrindo cliente HTTP, métricas, login, cadastro e perfil;
- Playwright configurado para E2E com API e PostgreSQL reais;
- banco dedicado `digitacourse_e2e`, schema recriado a cada execução e seed da demo restaurado antes e depois dos testes;
- 11 testes E2E cobrindo landing page, login demo, painel, trilhas, prática, resultado, progresso, perfil, logout e cadastro;
- screenshots, vídeos e traces gerados em falhas;
- limpeza das contas criadas com o prefixo `e2e.`;
- testes de componente no job de front-end e job independente de E2E na CI;
- relatório HTML e artefatos de falha publicados pela CI.

**Fora de escopo:** testes visuais pixel a pixel, testes de carga, cobertura mínima, Firefox/WebKit e auditoria com axe.

**Critérios de aceite:**

- [x] `npm run test` executa testes de componentes.
- [x] `npm run test:e2e` executa os fluxos críticos em navegador real.
- [x] A suíte E2E é determinística e limpa os dados que cria.
- [x] A CI publica traces e screenshots de falha.
- [x] Os fluxos cobertos estão documentados.

A comprovação em execução remota da CI depende da publicação do repositório.

---

### Entrega 05 — Acessibilidade automatizada e revisão assistiva

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entrega 04 |
| **Documento** | A criar |

**Objetivo:** garantir que as rotas principais sejam utilizáveis por teclado, leitores de tela e diferentes condições de visualização.

**Escopo previsto:**

- integrar axe-core aos testes E2E;
- auditar as rotas públicas e autenticadas em desktop e mobile;
- revisar navegação por teclado, foco visível, ordem de tabulação e menus;
- revisar contraste, tamanhos de alvo e estados de erro;
- rever respeito a `prefers-reduced-motion`;
- criar roteiro manual com NVDA ou VoiceOver;
- corrigir achados e documentar limitações;
- tornar a auditoria automatizada um gate da CI.

**Fora de escopo:** certificação WCAG completa e testes com todos os leitores de tela do mercado.

**Critérios de aceite:**

- [ ] Axe não reporta violações críticas ou sérias nas rotas principais.
- [ ] Os fluxos principais são concluídos apenas com teclado.
- [ ] Foco, labels, mensagens de erro e contraste são verificados.
- [ ] O roteiro manual está documentado e foi executado.
- [ ] A CI bloqueia regressões críticas de acessibilidade.

---

### Entrega 06 — Contrato OpenAPI e documentação viva da API

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entrega 01 |
| **Documento** | A criar |

**Objetivo:** tornar o contrato da API explícito, navegável e verificável.

**Escopo previsto:**

- integrar springdoc-openapi;
- documentar todos os endpoints, DTOs, validações, autenticação e erros;
- incluir exemplos de requisição e resposta;
- expor Swagger UI em desenvolvimento e desabilitar ou proteger em produção;
- gerar uma especificação estática versionada em `docs/`;
- adicionar testes que verifiquem status e formato dos principais contratos;
- documentar o fluxo de evolução e versionamento da API.

**Fora de escopo:** portal público para desenvolvedores e geração de SDKs.

**Critérios de aceite:**

- [ ] Todos os endpoints atuais aparecem na especificação.
- [ ] O esquema de autenticação Bearer está documentado.
- [ ] Erros e validações têm exemplos.
- [ ] A CI valida a geração da especificação.
- [ ] O README aponta para a documentação da API.

---

### Entrega 07 — Endurecimento de sessão e autenticação

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Segurança e identidade |
| **Dependências** | Entregas 01 e 06 |
| **Documento** | A criar |

**Objetivo:** reduzir o impacto de vazamento de token e permitir encerrar sessões de verdade.

**Escopo previsto:**

- decidir e documentar a estratégia de armazenamento: cookie `HttpOnly` + CSRF ou `localStorage` com compensações;
- adotar access token curto e refresh token com rotação;
- implementar revogação, logout no servidor e lista de sessões;
- incluir identificador de token e rotação de chave;
- tratar expiração e renovação no front-end sem perder o fluxo atual;
- adicionar testes de expiração, rotação, reuso e revogação.

**Fora de escopo:** MFA, login social e biometria.

**Critérios de aceite:**

- [ ] Access token tem vida curta e refresh token rotativo.
- [ ] Logout invalida a sessão no servidor.
- [ ] Token revogado não autentica.
- [ ] Reuso de refresh token é detectado.
- [ ] A decisão de armazenamento está documentada.
- [ ] Testes cobrem os cenários de falha.

---

### Entrega 08 — Rate limiting e proteção contra abuso

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Segurança e identidade |
| **Dependências** | Entrega 07 |
| **Documento** | A criar |

**Objetivo:** proteger login, cadastro, recuperação de senha, demo e tentativas contra automação e força bruta.

**Escopo previsto:**

- definir limites por IP e por conta para endpoints sensíveis;
- responder `429` com `Retry-After`;
- implementar backoff progressivo após falhas de login;
- incluir gancho para captcha quando necessário;
- respeitar proxies confiáveis ao ler IP;
- registrar métricas e logs de bloqueio;
- tornar limites configuráveis por ambiente;
- testar cenários de rajada e recuperação.

**Fora de escopo:** WAF, CDN e proteção de infraestrutura global.

**Critérios de aceite:**

- [ ] Limites estão documentados e configuráveis.
- [ ] Login e cadastro retornam `429` ao exceder a política.
- [ ] Usuários legítimos não ficam bloqueados indefinidamente.
- [ ] Bloqueios geram log e métrica.
- [ ] Testes cobrem janela, reset e `Retry-After`.

---

### Entrega 09 — Verificação de e-mail e recuperação de senha

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Segurança e identidade |
| **Dependências** | Entregas 07 e 08 |
| **Documento** | A criar |

**Objetivo:** confirmar a posse do e-mail e permitir recuperação de senha sem intervenção manual.

**Escopo previsto:**

- criar abstração de envio de e-mail com provedor SMTP ou API;
- usar capturador local de e-mails em desenvolvimento;
- gerar tokens de uso único, com hash e validade;
- implementar confirmação de conta e reenvio;
- implementar esqueci minha senha e redefinição;
- evitar enumeração de contas nas respostas;
- criar templates em pt-BR;
- integrar as telas existentes de cadastro e recuperação;
- testar expiração, reuso, token inválido e sucesso.

**Fora de escopo:** e-mails marketing e automação de campanhas.

**Critérios de aceite:**

- [ ] Cadastro envia confirmação de e-mail.
- [ ] Recuperação de senha funciona ponta a ponta.
- [ ] Tokens expiram e não podem ser reutilizados.
- [ ] A API não revela se um e-mail existe.
- [ ] O ambiente de desenvolvimento captura e-mails localmente.
- [ ] Testes cobrem os fluxos e falhas.

---

### Entrega 10 — Gestão de conta, privacidade e LGPD

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Segurança e identidade |
| **Dependências** | Entregas 07 e 09 |
| **Documento** | A criar |

**Objetivo:** dar autonomia ao aluno sobre seus dados e preparar o produto para exigências de privacidade.

**Escopo previsto:**

- alterar senha com confirmação da senha atual;
- alterar e-mail com verificação do novo endereço;
- excluir conta com confirmação forte e prazo claro;
- exportar dados pessoais em JSON;
- registrar consentimentos e versões de termos;
- criar página de privacidade e contato do responsável;
- definir retenção de dados e anonimização;
- auditar operações sensíveis;
- testar todos os fluxos e cascatas.

**Fora de escopo:** parecer jurídico, DPO externo e adequação legal completa.

**Critérios de aceite:**

- [ ] O aluno consegue trocar senha e e-mail com segurança.
- [ ] A exclusão remove ou anonimiza os dados previstos.
- [ ] A exportação entrega os dados do próprio usuário.
- [ ] Consentimentos e versões ficam registrados.
- [ ] A política de retenção está documentada.
- [ ] Testes cobrem autorização e cascatas.

---

### Entrega 11 — Segredos, perfis de ambiente e proteção da demo

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Segurança e identidade |
| **Dependências** | Entrega 07 |
| **Documento** | A criar |

**Objetivo:** impedir que configurações de desenvolvimento cheguem a ambientes publicados.

**Escopo previsto:**

- separar perfis `dev`, `test` e `prod`;
- exigir JWT secret forte e falhar rápido quando ausente em produção;
- remover senha demo e seed automático de produção;
- restringir ou desabilitar a restauração pública da demo;
- externalizar banco, CORS, e-mail e demais segredos;
- criar `.env.example` sem valores reais;
- documentar rotação de segredos;
- adicionar testes de configuração inválida.

**Fora de escopo:** cofre gerenciado de segredos, que pode ser acoplado ao ambiente de deploy.

**Critérios de aceite:**

- [ ] Produção não inicia com segredo padrão ou fraco.
- [ ] A conta demo não é recriada automaticamente em produção.
- [ ] A restauração da demo não é pública em produção.
- [ ] Cada perfil tem configuração documentada.
- [ ] Nenhum segredo real está no repositório.
- [ ] Testes cobrem as validações de configuração.

---

### Entrega 12 — Observabilidade, logs estruturados e health operacional

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Operação e confiabilidade |
| **Dependências** | Entregas 02 e 11 |
| **Documento** | A criar |

**Objetivo:** permitir detectar, localizar e diagnosticar falhas rapidamente.

**Escopo previsto:**

- adicionar Spring Boot Actuator com liveness, readiness e informações;
- criar logs JSON com request id, rota, status, duração e usuário quando aplicável;
- impedir log de senhas, tokens e dados sensíveis;
- expor métricas de latência, erro, login e banco;
- integrar OpenTelemetry ou serviço de erro, se necessário;
- definir alertas de indisponibilidade, erro 5xx e falha de banco;
- documentar dashboards e runbooks;
- testar endpoints de saúde e correlação de logs.

**Fora de escopo:** operação SRE completa e plantão 24/7.

**Critérios de aceite:**

- [ ] Liveness e readiness refletem o estado real do serviço.
- [ ] Logs são estruturados e correlacionáveis.
- [ ] Nenhum segredo aparece em logs.
- [ ] Métricas principais estão disponíveis.
- [ ] Alertas e runbooks estão documentados.
- [ ] Testes cobrem os endpoints operacionais.

---

### Entrega 13 — Empacotamento e publicação reproduzível

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Operação e confiabilidade |
| **Dependências** | Entregas 02, 03, 04, 11 e 12 |
| **Documento** | A criar |

**Objetivo:** publicar o DigitaCourse em ambiente acessível com processo repetível e reversível.

**Escopo previsto:**

- criar Dockerfiles multi-stage para backend e front-end;
- criar Compose de desenvolvimento com API, front-end e PostgreSQL;
- adicionar healthchecks e volumes;
- definir ambiente de homologação com HTTPS;
- configurar migrações Flyway na publicação;
- configurar fallback de SPA para rotas do React;
- criar pipeline de deploy após checks verdes;
- executar smoke test pós-deploy;
- documentar rollback e variáveis obrigatórias.

**Fora de escopo:** Kubernetes, multi-região e autoscaling avançado.

**Critérios de aceite:**

- [ ] `docker compose up` sobe o ambiente local completo.
- [ ] Homologação está acessível por HTTPS.
- [ ] Rotas profundas da SPA funcionam após recarregar.
- [ ] Migrações são aplicadas de forma controlada.
- [ ] Deploy e rollback estão documentados.
- [ ] Smoke test pós-deploy passa.

---

### Entrega 14 — Backup, restauração e retenção de dados

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Operação e confiabilidade |
| **Dependências** | Entrega 13 |
| **Documento** | A criar |

**Objetivo:** garantir recuperação de dados com perda máxima conhecida.

**Escopo previsto:**

- definir RPO e RTO aceitáveis;
- automatizar backup do PostgreSQL;
- definir retenção diária, semanal e mensal;
- armazenar cópias fora do servidor principal;
- criptografar backups;
- monitorar falhas de backup;
- executar simulação de restauração em homologação;
- documentar runbook de recuperação;
- registrar data e resultado dos testes.

**Fora de escopo:** recuperação de desastre multi-região.

**Critérios de aceite:**

- [ ] Backups são automáticos e monitorados.
- [ ] RPO e RTO estão documentados.
- [ ] Uma restauração completa foi testada.
- [ ] Backups são criptografados e fora do host principal.
- [ ] O runbook permite recuperação por outra pessoa.
- [ ] A retenção atende à política definida.

---

### Entrega 15 — Histórico paginado, resumo da conta e performance

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Produto, dados e administração |
| **Dependências** | Entrega 06 |
| **Documento** | A criar |

**Objetivo:** impedir que o snapshot da conta cresça sem limite e preparar leitura eficiente para relatórios.

**Escopo previsto:**

- separar resumo da conta de listas detalhadas;
- criar endpoint paginado de tentativas com filtros por período e lição;
- paginar notificações;
- manter compatibilidade temporária com o front-end;
- adaptar o painel para carregar histórico sob demanda;
- revisar índices e planos de consulta;
- medir payload e latência antes e depois;
- testar paginação, filtros e limites.

**Fora de escopo:** data warehouse e analytics avançado.

**Critérios de aceite:**

- [ ] O endpoint principal da conta não devolve histórico ilimitado.
- [ ] Tentativas e notificações têm paginação estável.
- [ ] Filtros por período e lição funcionam.
- [ ] Índices suportam as consultas principais.
- [ ] Há comparação de payload e latência.
- [ ] O front-end continua funcionando durante a transição.

---

### Entrega 16 — Papéis, autorização e auditoria de ações

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Produto, dados e administração |
| **Dependências** | Entregas 07 e 15 |
| **Documento** | A criar |

**Objetivo:** criar a base segura para administração e operações sensíveis.

**Escopo previsto:**

- definir papéis e permissões, no mínimo Aluno e Admin;
- aplicar autoridades no JWT e no servidor;
- proteger endpoints por papel e método;
- criar bootstrap seguro do primeiro administrador;
- registrar auditoria de quem alterou o quê, quando e de onde;
- impedir autoelevação de privilégio;
- testar `401`, `403` e isolamento entre contas.

**Fora de escopo:** SSO institucional e gestão corporativa de identidade.

**Critérios de aceite:**

- [ ] Papéis e permissões estão documentados.
- [ ] Endpoints administrativos exigem autorização no servidor.
- [ ] Aluno não consegue acessar dados administrativos.
- [ ] Ações sensíveis geram auditoria.
- [ ] O primeiro admin é criado por processo seguro.
- [ ] Testes cobrem os cenários de negação.

---

### Entrega 17 — Área administrativa de conteúdo

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Produto, dados e administração |
| **Dependências** | Entregas 06 e 16 |
| **Documento** | A criar |

**Objetivo:** permitir gerir trilhas, módulos e lições sem editar SQL.

**Escopo previsto:**

- criar rotas e telas administrativas preservando a identidade visual;
- listar, criar, editar, reordenar e publicar trilhas, módulos e lições;
- validar textos, durações, XP e ordem;
- separar rascunho de publicado;
- pré-visualizar a lição como aluno;
- registrar auditoria das alterações;
- garantir que o catálogo público mostre apenas conteúdo publicado;
- adicionar testes de serviço, API e interface.

**Fora de escopo:** editor rich text avançado, biblioteca de mídia e upload de imagens.

**Critérios de aceite:**

- [ ] Admin gerencia trilhas, módulos e lições pela interface.
- [ ] Conteúdo em rascunho não aparece para alunos.
- [ ] Ordenação e publicação são persistidas.
- [ ] Validações impedem conteúdo inválido.
- [ ] Alterações são auditadas.
- [ ] Testes e capturas documentam os fluxos.

---

### Entrega 18 — Área administrativa de alunos e relatórios

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Produto, dados e administração |
| **Dependências** | Entregas 15, 16 e 17 |
| **Documento** | A criar |

**Objetivo:** permitir acompanhar alunos, apoiar suporte e gerar visão pedagógica.

**Escopo previsto:**

- buscar e filtrar alunos com paginação;
- visualizar progresso, tentativas e últimas atividades;
- permitir ações controladas de suporte, como desbloquear ou redefinir progresso;
- exportar lista e indicadores em CSV;
- criar painel com alunos ativos, conclusão, WPM e precisão;
- aplicar isolamento por papel e auditoria;
- testar consultas, permissões e exportação.

**Fora de escopo:** BI externo, relatórios financeiros e folha de pagamento.

**Critérios de aceite:**

- [ ] Admin busca e pagina alunos.
- [ ] O detalhe mostra progresso e histórico do aluno.
- [ ] Ações de suporte são restritas e auditadas.
- [ ] Exportação CSV respeita filtros e permissões.
- [ ] O painel apresenta indicadores confiáveis.
- [ ] Testes cobrem paginação, autorização e exportação.

---

### Entrega 19 — Ranking real e gamificação no servidor

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Produto, dados e administração |
| **Dependências** | Entregas 15 e 16 |
| **Documento** | A criar |

**Objetivo:** substituir o ranking fictício e as métricas divergentes por regras consistentes no servidor.

**Escopo previsto:**

- definir regras de ranking, período, elegibilidade e desempate;
- respeitar a preferência de perfil público;
- calcular XP, sequência e conquistas no servidor;
- impedir duplicidade e valores incoerentes;
- criar proteções contra manipulação de tentativas;
- criar temporadas ou janelas de ranking;
- expor endpoints paginados e cacheáveis;
- integrar a interface existente;
- testar regras, privacidade e desempenho.

**Fora de escopo:** premiações físicas, ligas pagas e anti-fraude avançado com machine learning.

**Critérios de aceite:**

- [ ] O ranking usa dados reais e regras documentadas.
- [ ] Apenas perfis elegíveis aparecem.
- [ ] XP, sequência e conquistas são consistentes no servidor.
- [ ] Tentativas duplicadas ou inconsistentes não inflam o ranking.
- [ ] A consulta tem paginação e desempenho aceitável.
- [ ] Testes cobrem privacidade e empates.

---

### Entrega 20 — Notificações por e-mail e preferências de comunicação

| Campo | Valor |
| --- | --- |
| **Status** | Planejada |
| **Fase** | Produto, dados e administração |
| **Dependências** | Entregas 09 e 10 |
| **Documento** | A criar |

**Objetivo:** levar lembretes e resumos para fora do aplicativo, respeitando as preferências do aluno.

**Escopo previsto:**

- reutilizar a infraestrutura de e-mail da Entrega 09;
- criar resumo semanal, lembrete de sequência e avisos de conquista ou progresso;
- respeitar `emailReminders` e `weeklySummary`;
- criar descadastro e central de preferências;
- enfileirar envios com retentativa e idempotência;
- tratar bounce e falha de provedor;
- registrar histórico de envios;
- testar templates, preferências e retentativas.

**Fora de escopo:** push, WhatsApp, SMS e campanhas de marketing.

**Critérios de aceite:**

- [ ] E-mails de engajamento são enviados pelo provedor configurado.
- [ ] Preferências desligadas impedem envios não essenciais.
- [ ] Descadastro funciona sem login.
- [ ] Falhas são reprocessadas com limite.
- [ ] Envios e falhas ficam registrados.
- [ ] Testes cobrem preferências, retentativa e idempotência.

---

## 6. Critérios transversais

Toda entrega implementada deve atender a estes pontos, além dos critérios específicos:

### 6.1 Produto e experiência

- Interface e textos em pt-BR.
- Preservação da identidade visual, dos tokens de design e da responsividade.
- Nenhuma regressão nos fluxos de landing, autenticação, prática e perfil.
- Estados de carregamento, erro e vazio tratados.
- Respeito a `prefers-reduced-motion`.

### 6.2 Código e dados

- Mudanças consistentes com a arquitetura em camadas.
- Migrações Flyway apenas aditivas; nunca editar migração aplicada.
- Validação no servidor para toda entrada relevante.
- Consultas com índice quando houver filtro ou ordenação nova.
- Sem segredos, tokens ou dados pessoais em logs.

### 6.3 Qualidade

- Testes automatizados para regras e contratos alterados.
- `mvn test` verde no backend.
- Lint, testes e build verdes no front-end a partir da Entrega 03.
- Nenhum teste dependente de ordem ou de dados deixados por outro teste.
- Evidência de execução registrada na documentação.

### 6.4 Documentação

Cada entrega deve gerar um documento em `docs/entregas/` com:

- status, data, fase e dependências;
- objetivo e problema resolvido;
- escopo entregue e fora de escopo;
- decisões técnicas e alternativas descartadas;
- arquivos e migrações criados;
- como executar e validar;
- resultados das validações;
- limitações e próximos passos;
- critérios de aceite marcados.

O README da raiz, o README do backend e o índice de documentação devem ser atualizados quando a entrega mudar a execução ou a estrutura.

### 6.5 Definição de pronto

Uma entrega só é considerada concluída quando:

- [ ] o escopo acordado está implementado;
- [ ] os testes aplicáveis passam;
- [ ] a documentação própria está publicada;
- [ ] os READMEs afetados foram atualizados;
- [ ] não há segredo ou dado local versionado;
- [ ] os critérios de aceite foram verificados;
- [ ] o estado final dos bancos e serviços foi registrado.

---

## 7. Riscos e decisões pendentes

| Tema | Risco ou decisão pendente | Encaminhamento |
| --- | --- | --- |
| Repositório | Repositório Git e CI existem, mas não há remoto GitHub nem proteção da `main` | Publicar, executar a CI e ativar branch protection antes de mudanças grandes |
| Banco de teste | A suíte exige PostgreSQL local ativo | Documentado; CI deve subir serviço PostgreSQL |
| E2E local | A suíte E2E exige PostgreSQL, JDK 21 e Maven, além do Chromium do Playwright | Documentado no README e no `CONTRIBUTING.md`; CI prepara o ambiente |
| Logout | O fluxo atual termina em `/entrar`, embora o Sidebar tente navegar para `/` | Comportamento registrado nos testes; reavaliar na Entrega 07 |
| Ferramentas de lint | ESLint 9 é a última linha suportada pelo `eslint-plugin-jsx-a11y` atual | Acompanhar o plugin e migrar para ESLint 10 quando houver suporte |
| Sessão | `localStorage` é simples, mas vulnerável a XSS | Decidir entre cookie `HttpOnly` + CSRF e alternativas na Entrega 07 |
| E-mail | Provedor ainda não definido | Escolher SMTP ou API na Entrega 09; manter capturador local |
| Deploy | Plataforma de hospedagem ainda não definida | Definir na Entrega 13; evitar acoplamento prematuro |
| Administração | Escopo acadêmico pode ser menor que o produto real | Validar profundidade das Entregas 17 e 18 com o orientador |
| LGPD | Exigências variam conforme operação e instituição | Revisar com responsável legal antes da Entrega 10 |
| Ranking | Regras podem incentivar digitação apressada | Validar fórmula com precisão e consistência, não só WPM |
| Escopo | 20 entregas é um plano extenso | Implementar sob demanda, sem antecipar complexidade |

---

## 8. Próximos passos recomendados

1. Publicar o repositório no GitHub, executar a CI e ativar a proteção da `main`.
2. Fechar a fundação com **05 e 06**.
3. Antes de qualquer publicação, executar **07, 08, 09, 10 e 11**.
4. Publicar com segurança depois de **12, 13 e 14**.
5. Evoluir produto e administração com **15 a 20**, conforme prioridade acadêmica.

A próxima entrega só deve ser iniciada quando solicitada.

---

## 9. Histórico

| Data | Entrega | Resultado |
| --- | --- | --- |
| 23/11/2026 | 01 — Testes de integração da API | 24 testes, PostgreSQL dedicado, documentação publicada |
| 24/11/2026 | 02 — Versionamento Git, higiene e CI | Repositório em `main`, 24 testes e build verdes localmente, workflow validado; publicação remota pendente |
| 25/11/2026 | 03 — Lint, formatação e análise estática | ESLint 9, Prettier e `.editorconfig`; baseline de 15 erros corrigido; lint e formatação na CI; validação local completa |
| 26–27/11/2026 | 04 — Testes de componentes e E2E | 46 testes de componente e 11 E2E em 1,2 min; banco PostgreSQL dedicado; job de E2E na CI; validação local completa |
