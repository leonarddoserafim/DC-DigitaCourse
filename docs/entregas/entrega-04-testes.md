# Entrega 04 — Testes de componentes e E2E dos fluxos críticos

| Campo | Valor |
| --- | --- |
| **Status** | Concluída localmente em 26–27/11/2026 |
| **Data** | 26–27/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entregas 02 e 03 |
| **Stack** | Vitest 5, React Testing Library 16, jest-dom 8, user-event 14, jsdom 29, Playwright 1.65, `pg` 8, Node.js 22 na CI |
| **Commit de implementação** | `0ff2cf2` |
| **Documento mestre** | [Roadmap de 20 entregas](README.md) |

---

## 1. Objetivo

Colocar o front-end sob testes automatizados reproduzíveis. A entrega cobre duas camadas complementares:

- **testes de componentes e utilitários** com Vitest, React Testing Library e jsdom, executados sem navegador;
- **testes ponta a ponta (E2E)** com Playwright, navegador Chromium real, API Spring Boot real e PostgreSQL real.

O foco são os fluxos que sustentam o produto: entrada na plataforma, cadastro, painel, trilhas, prática, resultado, progresso, perfil e logout. A entrega também cria um banco dedicado ao E2E, limpa os dados criados pelos testes e integra as duas suítes à CI.

---

## 2. Problema encontrado

Antes desta entrega:

- o front-end não tinha testes automatizados versionados;
- erros em métricas, cliente HTTP e formulários só eram percebidos manualmente;
- os fluxos de login, prática e perfil dependiam de verificações exploratórias;
- não havia banco isolado para testes de navegador;
- a CI validava lint, formatação e build, mas não comportamento;
- não existiam traces, screenshots ou vídeos para diagnosticar falhas de interface.

A Entrega 03 havia deixado os testes de componentes e E2E explicitamente fora de escopo, para serem tratados nesta entrega.

---

## 3. Escopo entregue

- Vitest configurado com ambiente jsdom, setup global e scripts `test` e `test:watch`.
- React Testing Library, `jest-dom` e `user-event` para testes centrados no usuário.
- 46 testes de componente e utilitários, distribuídos em cinco arquivos:
  - cliente HTTP da API;
  - métricas e regras de progresso;
  - login;
  - cadastro;
  - perfil.
- Playwright configurado para Chromium, com API e front-end reais.
- Banco PostgreSQL dedicado `digitacourse_e2e`, recriado a cada execução.
- Seed e restauração da conta demo antes e depois de cada teste E2E.
- 11 testes E2E em quatro specs, cobrindo landing page, autenticação, painel, trilhas, prática, resultado, progresso e perfil.
- Limpeza das contas criadas pelos testes ao final da execução.
- Screenshots, vídeos e traces apenas em falhas.
- Relatório HTML do Playwright e artefatos publicados na CI.
- Job separado de E2E na CI, com PostgreSQL 17, JDK 21, Node.js 22 e Chromium.
- Testes de componente no job de qualidade do front-end.
- Documentação da cobertura, decisões, execução e limitações.

### Fora de escopo

- Testes visuais pixel a pixel ou regressão de snapshot de imagem.
- Testes de carga, estresse ou concorrência.
- Auditoria automatizada de acessibilidade com axe, prevista na Entrega 05.
- Testes em Firefox, WebKit ou dispositivos móveis reais.
- Cobertura mínima de código ou gate de cobertura.
- Testes de contrato da API, previstos na Entrega 06.
- Alteração intencional do comportamento de logout ou de outras regras de produto.
- Publicação do repositório e execução remota da CI.

---

## 4. Decisões tomadas

### 4.1 Vitest em vez de Jest

O projeto usa Vite 8, ESM e JSX com o plugin React. O Vitest reutiliza a mesma resolução de módulos e transformação do Vite, sem uma configuração paralela de Babel ou `ts-jest`.

Alternativas descartadas:

- **Jest:** exigiria configuração adicional para ESM, JSX e importação de CSS, sem ganho para o escopo.
- **Testes apenas E2E:** seriam mais lentos e dificultariam isolar regras de métricas e erros do cliente HTTP.

### 4.2 React Testing Library e jsdom

Os testes de componente usam consultas por papel, label e texto, priorizando a experiência do usuário. O `user-event` simula digitação, clique e teclado de forma mais próxima do navegador do que eventos disparados manualmente.

O ambiente é jsdom, suficiente para formulários, contexto, rotas em memória e estados de carregamento. A renderização visual real fica a cargo do Playwright.

### 4.3 jsdom 29 em vez de jsdom 31

A versão 31 do jsdom exige Node `^22.22.2 || ^24.15.0`. O ambiente local desta entrega usa Node `24.14.0`, e o jsdom 29.1.1 atende sem exigir atualização do Node. A CI usa Node.js 22 e permanece compatível.

A dependência fica fixada na linha 29 até que o ambiente local seja atualizado. O Vitest 5 e o React Testing Library 16 funcionam normalmente com essa versão.

### 4.4 Playwright em vez de Cypress

O Playwright foi escolhido por:

- executar Chromium headless com instalação local;
- oferecer `webServer` para subir API e front-end automaticamente;
- permitir chamadas HTTP de apoio pelo fixture `request`;
- gerar trace viewer, screenshots e vídeos em falhas;
- ter bom suporte a Windows e à CI Linux.

O Cypress não foi adotado para evitar uma segunda pilha de servidor e um modelo de execução diferente do já usado no projeto.

### 4.5 API e PostgreSQL reais no E2E

Os testes E2E não usam mocks de API. Cada execução sobe o Spring Boot com Flyway e um banco dedicado `digitacourse_e2e`. Isso valida o contrato real, a persistência, a autenticação JWT, a restauração da demo e as regras de progresso.

Para manter a suíte determinística:

- o banco é criado se não existir;
- o schema `public` é recriado antes da execução;
- o Flyway aplica as migrações e o catálogo ao iniciar a API;
- a conta demo é restaurada antes e depois de cada teste que a utiliza;
- as contas criadas com o prefixo `e2e.` são removidas no teardown;
- a execução usa `workers: 1` e `fullyParallel: false`, evitando disputa pelo mesmo estado da demo.

### 4.6 Portas e proxy isolados

| Serviço | Porta | Observação |
| --- | --- | --- |
| PostgreSQL | 5432 | Pode ser o PostgreSQL local ou o serviço da CI |
| API Spring Boot | 8081 | Evita conflito com a API de desenvolvimento em 8080 |
| Front-end (preview) | 4173 | Build de produção servido pelo Vite |

O front-end usa `VITE_API_PROXY_TARGET` para encaminhar `/api` à API de teste. O valor padrão continua `http://127.0.0.1:8080`, preservando o desenvolvimento normal.

O preview precisa de `--host 127.0.0.1`. Sem isso, o Vite pode escutar apenas em IPv6 e o Playwright, que acessa `127.0.0.1`, expira ao aguardar o servidor.

### 4.7 Fixture da conta demo

O fixture `demo`:

1. chama `POST /api/auth/demo/restore` antes do teste;
2. abre `/` e injeta o token retornado no `localStorage`;
3. navega para `/app` e aguarda o shell autenticado;
4. executa o teste;
5. restaura a demo novamente ao final.

O token é injetado com `page.evaluate` depois da primeira navegação, e não com `addInitScript`. O `addInitScript` seria executado em toda navegação e recolocaria o token depois do logout, impedindo o teste de sessão encerrada.

### 4.8 Logout refletindo o comportamento atual

O botão **Sair da conta** limpa o token e chama `navigate('/')`, mas o `ProtectedRoute` reage à perda da sessão antes da navegação e redireciona para `/entrar`. O comportamento observado no navegador é terminar na tela de login, com o toast **Sessão encerrada**.

Os testes E2E registram esse comportamento real. Alterar o fluxo para voltar à landing page seria uma mudança de produto fora do escopo desta entrega e pode ser reavaliada junto ao endurecimento de sessão da Entrega 07.

### 4.9 Seletores estáveis

Os testes usam papéis acessíveis, labels, placeholders e textos exatos. Evita-se depender de classes CSS ou da estrutura interna dos componentes.

Onde a interface repete links legítimos — navbar e footer, por exemplo — o teste limita o escopo à navegação principal ou usa `.first()`. Onde o mesmo texto aparece no toast e na região `sr-only` de status, o teste usa `{ exact: true }` para selecionar o elemento visível correto.

### 4.10 Limpeza sem endpoint de exclusão

O produto ainda não tem endpoint de exclusão de conta. O teardown remove diretamente do banco os usuários cujo e-mail começa com `e2e.` e termina com `@digitacourse.test`. As tabelas dependentes usam `ON DELETE CASCADE`, então preferências, tentativas, lições concluídas e notificações são removidas junto.

### 4.11 Artefatos apenas em falha

Traces, screenshots e vídeos são gerados com `retain-on-failure`, `only-on-failure` e `retain-on-failure`. Isso reduz o tamanho dos artefatos e mantém a execução normal leve. A CI publica o relatório HTML e a pasta de resultados mesmo quando o job falha.

---

## 5. Estrutura criada

```text
frontend/
├── e2e/
│   ├── fixtures.js                  # Fixture da conta demo e token
│   ├── global-teardown.js           # Limpeza das contas E2E
│   ├── landing.spec.js              # Landing page e CTAs
│   ├── auth.spec.js                 # Login demo, cadastro, logout e proteção
│   ├── learning.spec.js             # Painel, trilhas, prática e progresso
│   ├── profile.spec.js              # Perfil, persistência e redefinição
│   ├── scripts/
│   │   ├── prepare-db.js            # Cria e recria o banco E2E
│   │   └── start-backend.js         # Sobe a API com Maven/Spring Boot
│   └── support/
│       ├── config.js                # Portas, banco e segredo do E2E
│       └── database.js              # Conexão, reset e limpeza com pg
├── playwright.config.js             # Playwright, webServers e artefatos
├── vitest.config.js                 # Vitest com jsdom
└── src/
    ├── test/
    │   └── setup.js                 # jest-dom e cleanup
    ├── lib/
    │   ├── api.test.js              # Cliente HTTP
    │   └── metrics.test.js          # Métricas e progresso
    └── pages/
        ├── auth/
        │   ├── LoginPage.test.jsx
        │   └── SignupPage.test.jsx
        └── app/
            └── ProfilePage.test.jsx
```

---

## 6. Configuração

### 6.1 Vitest

| Item | Configuração |
| --- | --- |
| Arquivo | `frontend/vitest.config.js` |
| Ambiente | `jsdom` |
| Setup | `src/test/setup.js` |
| Arquivos | `src/**/*.test.{js,jsx}` |
| CSS | Desabilitado nos testes |
| Mocks | Limpos automaticamente entre testes |
| Plugin | `@vitejs/plugin-react` |

O setup registra os matchers do `jest-dom` no Vitest e executa `cleanup()` depois de cada teste.

### 6.2 Playwright

| Item | Configuração |
| --- | --- |
| Arquivo | `frontend/playwright.config.js` |
| Navegador | Chromium desktop |
| Paralelismo | `workers: 1`, `fullyParallel: false` |
| Timeout por teste | 60 s |
| Timeout de expectativa | 10 s |
| Retentativas | 1 na CI; nenhuma localmente |
| Trace | `retain-on-failure` |
| Screenshot | `only-on-failure` |
| Vídeo | `retain-on-failure` |
| Locale | `pt-BR` |
| Fuso | `America/Sao_Paulo` |
| Relatório | HTML em `playwright-report/` |

Os `webServer` sobem a API e o preview do front-end. O Playwright aguarda `/api/health` e a página inicial antes de iniciar os testes. O teardown global remove as contas E2E.

### 6.3 Scripts

| Script | Comando | Função |
| --- | --- | --- |
| `test` | `vitest run` | Executa os testes de componente uma vez |
| `test:watch` | `vitest` | Executa em modo observação |
| `test:e2e` | `node e2e/scripts/prepare-db.js && playwright test` | Prepara o banco e executa o E2E |
| `test:e2e:report` | `playwright show-report` | Abre o relatório HTML |
| `e2e:serve` | `vite build && vite preview --host 127.0.0.1 --port 4173 --strictPort` | Gera e serve o build usado no E2E |

### 6.4 Variáveis do E2E

| Variável | Padrão | Função |
| --- | --- | --- |
| `DIGITACOURSE_E2E_DB_HOST` | `127.0.0.1` | Host do PostgreSQL |
| `DIGITACOURSE_E2E_DB_PORT` | `5432` | Porta do PostgreSQL |
| `DIGITACOURSE_E2E_DB_USER` | `postgres` | Usuário do banco |
| `DIGITACOURSE_E2E_DB_PASSWORD` | vazio | Senha do banco |
| `DIGITACOURSE_E2E_DB_NAME` | `digitacourse_e2e` | Banco dedicado |
| `DIGITACOURSE_E2E_API_PORT` | `8081` | Porta da API de teste |
| `DIGITACOURSE_E2E_WEB_PORT` | `4173` | Porta do preview |
| `DIGITACOURSE_E2E_JWT_SECRET` | Segredo local do E2E | Assinatura dos tokens de teste |
| `DIGITACOURSE_MAVEN_HOME` | Caminho do Maven | Usado pelo script da API |
| `JAVA_HOME` | Caminho do JDK 21 | Usado pelo Maven |
| `VITE_API_PROXY_TARGET` | `http://127.0.0.1:8080` | Destino do proxy `/api` |

### 6.5 CI

O job de front-end passou a executar os testes de componente antes do lint e do build:

```text
npm ci
npm run test
npm run lint
npm run format:check
npm run build
```

Foi criado o job independente **E2E - fluxos críticos**, com:

- PostgreSQL 17 como serviço e banco `digitacourse_e2e`;
- JDK 21 Temurin com cache Maven;
- Node.js 22 com cache npm;
- `npm ci`;
- `npx playwright install --with-deps chromium`;
- `npm run test:e2e` com as variáveis do banco de teste;
- publicação do relatório HTML e de `test-results/` mesmo em falha;
- timeout de 30 minutos e uma retentativa por teste na CI.

---

## 7. Cobertura dos testes

### 7.1 Testes de componente

**Total: 46 testes em 5 arquivos.**

| Arquivo | Testes | Cobertura |
| --- | ---: | --- |
| `src/lib/api.test.js` | 12 | Token no `localStorage`, catálogo público, login, Bearer, PATCH de perfil, tentativa, tratamento de 401, erro sem JSON, resposta vazia e falha de rede |
| `src/lib/metrics.test.js` | 14 | Datas, ordenação, janela de dias, sequência, estatísticas/XP/nível, progresso, próxima trilha, desbloqueio de lições, conquistas, atividade semanal, heatmap, desafios e ranking |
| `src/pages/auth/LoginPage.test.jsx` | 8 | Renderização, login, destino salvo, erro da API, conta demo, erro da demo, carregamento e visibilidade da senha |
| `src/pages/auth/SignupPage.test.jsx` | 5 | Campos obrigatórios, aceite dos termos, senhas diferentes, cadastro com sucesso e erro da API |
| `src/pages/app/ProfilePage.test.jsx` | 7 | Identidade e preferências, salvamento, validação do nome, erro ao salvar, redefinição de progresso, restauração da demo e logout |

### 7.2 Testes E2E

**Total: 11 testes em 4 arquivos.**

| Arquivo | Testes | Fluxos cobertos |
| --- | ---: | --- |
| `e2e/landing.spec.js` | 2 | Proposta da landing, navegação principal, CTAs para cadastro e login |
| `e2e/auth.spec.js` | 3 | Login com conta demo, cadastro, logout, novo login e proteção de rota privada |
| `e2e/learning.spec.js` | 4 | Painel, meta diária, trilhas, detalhe da trilha, prática, resultado, registro de tentativa, progresso, métricas e gráfico |
| `e2e/profile.spec.js` | 2 | Atualização de nome, meta e preferências com persistência após recarregar; redefinição de progresso com confirmação |

### 7.3 Rastreabilidade dos fluxos críticos

| Fluxo solicitado | Onde é coberto |
| --- | --- |
| Landing page | `landing.spec.js` |
| Login demo | `auth.spec.js` e testes de `LoginPage` |
| Painel | `learning.spec.js` e testes de métricas |
| Trilhas | `learning.spec.js` |
| Prática | `learning.spec.js` |
| Resultado | `learning.spec.js` |
| Progresso | `learning.spec.js` e testes de métricas |
| Perfil | `profile.spec.js` e testes de `ProfilePage` |
| Logout | `auth.spec.js` e testes de `ProfilePage` |
| Cadastro | `auth.spec.js` e testes de `SignupPage` |

---

## 8. Como executar

### 8.1 Testes de componente

```bash
cd frontend
npm ci
npm run test
```

Para acompanhar durante o desenvolvimento:

```bash
npm run test:watch
```

Não é necessário PostgreSQL nem navegador.

### 8.2 Testes E2E

Pré-requisitos:

- PostgreSQL 17 em execução;
- usuário do banco com permissão para criar o banco `digitacourse_e2e`;
- JDK 21 e Maven 3.9+ no `PATH` ou apontados por `JAVA_HOME` e `DIGITACOURSE_MAVEN_HOME`;
- dependências do front-end instaladas;
- Chromium do Playwright instalado.

Na primeira vez:

```bash
cd frontend
npm ci
npx playwright install chromium
npm run test:e2e
```

O comando `prepare-db.js` cria o banco se necessário e recria o schema `public`. Em seguida, o Playwright sobe a API na porta 8081, gera o build e serve o preview na porta 4173. Ao final, o teardown remove as contas `e2e.%@digitacourse.test`.

Para abrir o relatório:

```bash
npm run test:e2e:report
```

No PowerShell do Windows, use `npm.cmd` se a política de scripts bloquear `npm.ps1`.

---

## 9. Validações realizadas

### 9.1 Testes de componente

```text
npm run test
Test Files  5 passed (5)
Tests       46 passed (46)
```

Tempo medido: 27,7 s na execução final; a primeira execução pode chegar a 50 s por causa da transformação inicial dos módulos.

### 9.2 Testes E2E

```text
npm run test:e2e
11 passed (1.2m)
```

A execução sobe API, PostgreSQL e preview reais, com uma única worker. O tempo total inclui a compilação do backend, o build do front-end e os 11 testes.

### 9.3 Qualidade e build

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | Aprovado, sem erros ou avisos |
| `npm run format:check` | Aprovado |
| `npm run build` | Aprovado |
| `actionlint` | Workflow válido |
| `yaml-lint` | YAML válido |

### 9.4 Resumo

| Verificação | Resultado |
| --- | --- |
| Testes de componente | 46/46 |
| Testes E2E | 11/11 em 1,2 min |
| Banco E2E | `digitacourse_e2e` recriado e limpo |
| Artefatos de falha | Screenshot, vídeo e trace configurados |
| CI | Testes de componente e job E2E configurados |
| Alteração visual | Nenhuma |

---

## 10. Limitações e riscos

- A CI foi validada localmente com `actionlint` e `yaml-lint`, mas ainda não executou no GitHub porque o repositório não foi publicado em um remoto.
- O E2E roda apenas em Chromium; Firefox, WebKit e dispositivos móveis reais não fazem parte desta entrega.
- O E2E depende de PostgreSQL, JDK e Maven disponíveis. A CI cobre esse ambiente; uma pessoa nova precisa prepará-lo localmente.
- O banco `digitacourse_e2e` é recriado a cada execução. Não use esse nome para dados que precisem ser preservados.
- A suíte usa a conta demo compartilhada e, por isso, roda com uma worker. Aumentar o paralelismo exigiria contas isoladas por teste.
- O logout termina em `/entrar`, refletindo o comportamento atual do `ProtectedRoute`. A intenção de voltar à landing page pode ser revista na Entrega 07.
- Não há endpoint de exclusão de conta; a limpeza das contas E2E é feita diretamente no banco pelo teardown.
- Vídeos e traces de falha podem ocupar espaço em disco. As pastas `playwright-report/`, `test-results/` e `blob-report/` são ignoradas pelo Git.
- Testes visuais pixel a pixel, testes de carga e auditoria com axe continuam fora desta entrega.
- A primeira execução em uma máquina nova é mais lenta por causa do download do Chromium e da compilação do backend.

---

## 11. Critérios de aceite

- [x] `npm run test` executa testes de componentes.
- [x] `npm run test:e2e` executa os fluxos críticos em navegador real.
- [x] A suíte E2E é determinística e limpa os dados que cria.
- [x] A CI publica traces e screenshots de falha.
- [x] Os fluxos cobertos estão documentados.

O critério da CI foi verificado na configuração e nos validadores de workflow. A comprovação em execução remota depende da publicação do repositório.

---

## 12. Arquivos entregues

| Arquivo | Função |
| --- | --- |
| `frontend/vitest.config.js` | Configuração do Vitest com jsdom |
| `frontend/src/test/setup.js` | Matchers do jest-dom e cleanup |
| `frontend/src/lib/api.test.js` | Testes do cliente HTTP |
| `frontend/src/lib/metrics.test.js` | Testes de métricas e progresso |
| `frontend/src/pages/auth/LoginPage.test.jsx` | Testes do login |
| `frontend/src/pages/auth/SignupPage.test.jsx` | Testes do cadastro |
| `frontend/src/pages/app/ProfilePage.test.jsx` | Testes do perfil |
| `frontend/playwright.config.js` | Configuração do Playwright |
| `frontend/e2e/fixtures.js` | Fixture da conta demo |
| `frontend/e2e/global-teardown.js` | Limpeza das contas E2E |
| `frontend/e2e/landing.spec.js` | E2E da landing page |
| `frontend/e2e/auth.spec.js` | E2E de autenticação e logout |
| `frontend/e2e/learning.spec.js` | E2E de painel, trilhas, prática e progresso |
| `frontend/e2e/profile.spec.js` | E2E de perfil |
| `frontend/e2e/scripts/prepare-db.js` | Preparação do banco E2E |
| `frontend/e2e/scripts/start-backend.js` | Inicialização da API |
| `frontend/e2e/support/config.js` | Configuração do ambiente E2E |
| `frontend/e2e/support/database.js` | Operações de banco com `pg` |
| `frontend/package.json` | Scripts e dependências de teste |
| `frontend/package-lock.json` | Lockfile atualizado |
| `frontend/vite.config.js` | Proxy configurável por ambiente |
| `frontend/eslint.config.js` | Globals e exceção para fixtures do Playwright |
| `frontend/.gitignore` | Artefatos de teste ignorados |
| `frontend/.prettierignore` | Relatórios fora da formatação |
| `.github/workflows/ci.yml` | Testes de componente e job E2E |
| `.gitignore` | Relatórios e traces ignorados |
| `README.md` | Status, comandos e CI |
| `CONTRIBUTING.md` | Fluxo de testes e checks |
| `backend/README.md` | CI e limites atualizados |
| `docs/README.md` | Índice de entregas atualizado |
| `docs/entregas/README.md` | Roadmap e status da Entrega 04 |
| `docs/entregas/entrega-04-testes.md` | Este documento |

---

## 13. Próximos passos

1. Publicar o repositório no GitHub, executar a CI pela primeira vez e ativar a proteção da `main` com os checks **Backend - testes de integração**, **Front-end - qualidade e build** e **E2E - fluxos críticos**.
2. **Entrega 05:** integrar axe-core aos testes E2E e revisar acessibilidade por teclado e leitor de tela.
3. Avaliar Firefox e WebKit em uma entrega futura, se houver requisito de compatibilidade.
4. Reavaliar o destino do logout na Entrega 07, junto com a estratégia de sessão e revogação.
5. Manter a suíte E2E enxuta: novos fluxos críticos entram com dados isolados e limpeza determinística.

---

## 14. Histórico

| Data | Evento |
| --- | --- |
| 26/11/2026 | Vitest, React Testing Library e jsdom configurados |
| 26/11/2026 | 46 testes de componente e utilitários implementados |
| 26/11/2026 | Playwright, banco E2E e fixture da demo configurados |
| 26/11/2026 | 11 testes E2E dos fluxos críticos implementados |
| 27/11/2026 | Suíte E2E estabilizada e aprovada em 1,2 min |
| 27/11/2026 | Testes de componente e job E2E adicionados à CI |
| 27/11/2026 | Lint, formatação, testes, build, actionlint e yaml-lint aprovados |
| 27/11/2026 | Documentação da entrega publicada |
