# Entrega 02 — Versionamento Git, higiene e pipeline de CI

| Campo | Valor |
| --- | --- |
| **Status** | Concluída localmente — publicação e proteção da `main` pendentes |
| **Data** | 24/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entrega 01 |
| **Stack** | Git, GitHub Actions, Maven, JDK 21, PostgreSQL 17, Node.js 22, npm, Vite |
| **Commit de implementação** | `3ab50c7` (`3ab50c7a8204687219a35e4031f67f025b5e4ac2`) |
| **Documento mestre** | [Roadmap de 20 entregas](README.md) |

---

## 1. Objetivo

Colocar o DigitaCourse sob controle de versão confiável e proteger a suíte da Entrega 01 com uma pipeline de integração contínua. A partir desta entrega, toda alteração deve passar por testes do backend e build do front-end antes de chegar à branch estável.

A entrega não altera o comportamento do produto. Ela cria a fundação de colaboração, revisão e automação que será usada pelas próximas 18 entregas do roadmap.

---

## 2. Problema encontrado

Antes desta entrega:

- o diretório do projeto não era um repositório Git;
- não havia histórico, branch estável, `.gitignore` ou `.gitattributes`;
- artefatos de build e dependências instaladas ficavam misturados aos arquivos do projeto;
- os 24 testes da Entrega 01 só rodavam por iniciativa local;
- não havia verificação automática de build do front-end;
- não existia um fluxo documentado de branches, commits e pull requests;
- não havia proteção contra merge de código quebrado.

---

## 3. Escopo entregue

- Repositório Git inicializado na branch `main`, com identidade local já configurada no ambiente.
- `.gitignore` para Java/Maven, Node/Vite, IDEs, sistemas operacionais, ambientes, logs, bancos locais e ferramentas portáteis.
- `.gitattributes` para normalizar line endings, preservar scripts do Windows em CRLF e tratar imagens, documentos e binários sem conversão.
- Workflow `.github/workflows/ci.yml` com dois jobs independentes:
  - backend com PostgreSQL 17 de serviço, JDK 21, cache Maven e `mvn -B test`;
  - front-end com Node.js 22, cache npm, `npm ci` e `npm run build`.
- Publicação dos relatórios Surefire e do conteúdo de `frontend/dist` como artefatos.
- Template de pull request com checklist de escopo, testes, documentação, segredos e migrações.
- `CONTRIBUTING.md` com preparação do ambiente, branches, Conventional Commits, fluxo de PR, checks e proteção da `main`.
- Documentação da entrega e atualização do roadmap e dos READMEs.
- Primeiro commit com 184 arquivos versionados e nenhum artefato de build.

### Fora de escopo

- Publicação do repositório em um remoto GitHub.
- Configuração efetiva de branch protection no GitHub.
- Deploy, release automatizada ou publicação de pacotes.
- Cobertura mínima, JaCoCo ou quality gate de cobertura.
- Assinatura de commits ou verificação de autoria.
- Lint, testes de front-end e E2E, previstos nas Entregas 03 e 04.
- Templates de issue.
- Maven Wrapper.

---

## 4. Decisões tomadas

### 4.1 GitHub Actions como plataforma de CI

O projeto já seria publicado no GitHub e não possui infraestrutura própria de CI. GitHub Actions oferece execução em `ubuntu-latest`, serviços de PostgreSQL, cache de dependências e artefatos sem custo para um repositório acadêmico público.

Alternativas como Jenkins, GitLab CI ou CircleCI foram descartadas por exigirem conta, infraestrutura ou configuração adicional sem benefício para esta etapa.

### 4.2 Dois jobs independentes

Backend e front-end têm ciclos e ferramentas diferentes. Separar em jobs permite:

- identificar rapidamente qual camada quebrou;
- executar em paralelo;
- exigir checks distintos na proteção da branch;
- manter tempos limite específicos: 20 minutos para o backend e 10 minutos para o front-end.

Um único job economizaria alguns segundos de setup, mas reduziria o diagnóstico e a granularidade dos checks obrigatórios.

### 4.3 PostgreSQL 17 como serviço

O job do backend usa a imagem oficial `postgres:17`, com health check via `pg_isready`, banco `digitacourse_test`, usuário `postgres` e senha restrita ao ambiente efêmero do runner.

A suíte mantém a decisão da Entrega 01 de usar PostgreSQL real em vez de H2. Testcontainers continuam fora de escopo: o serviço nativo do GitHub Actions atende ao mesmo objetivo com menos complexidade e sem exigir Docker dentro do job.

As variáveis injetadas são exatamente as previstas pelo perfil `test`:

```text
DIGITACOURSE_TEST_DB_URL=jdbc:postgresql://127.0.0.1:5432/digitacourse_test
DIGITACOURSE_TEST_DB_USER=postgres
DIGITACOURSE_TEST_DB_PASSWORD=postgres
DIGITACOURSE_TEST_JWT_SECRET=<segredo efêmero com 32+ caracteres>
```

O segredo do JWT é exclusivo da CI e não é usado em desenvolvimento ou produção.

### 4.4 Node.js 22 na CI

O Vite 8 exige `^20.19.0 || >=22.12.0`. A CI adota Node.js 22, que é a linha LTS e atende ao requisito. O ambiente local pode usar versões mais novas, como o Node.js 24 já presente na máquina de desenvolvimento.

### 4.5 Actions atualizadas para os majors atuais

As actions foram verificadas no GitHub em 24/11/2026 e configuradas nos majors correntes:

| Action | Versão |
| --- | --- |
| `actions/checkout` | `v7` |
| `actions/setup-java` | `v6` |
| `actions/setup-node` | `v7` |
| `actions/upload-artifact` | `v7` |

Os majors são referenciados por tag, não por SHA. Isso simplifica a manutenção acadêmica; um repositório de produção pode fixar SHAs e usar Dependabot ou Renovate para atualizações controladas.

### 4.6 Normalização de line endings

O projeto é desenvolvido no Windows, mas a CI roda em Linux. O `.gitattributes` define `* text=auto eol=lf` para evitar diffs falsos e garantir consistência no runner.

Exceções:

- `.bat`, `.cmd` e `.ps1` usam CRLF;
- imagens, fontes, PDFs, arquivos compactados, documentos Office e binários Java são marcados como `binary`;
- SVG e XML permanecem textuais para permitir diff.

### 4.7 Trunk-based simplificado e Conventional Commits

A branch `main` é a única branch permanente. Trabalhos futuros usam branches curtas com prefixos `feat/`, `fix/`, `docs/`, `test/`, `chore/` ou `ci/`.

Os commits seguem Conventional Commits com assunto em pt-BR. Isso mantém o histórico legível e prepara o projeto para changelogs automáticos, se forem necessários no futuro.

### 4.8 Template de pull request, sem template de issue

O template de PR concentra o checklist que realmente bloqueia uma mudança: escopo, testes, build, documentação, segredos e migrações.

Templates de issue foram deliberadamente adiados. O projeto é acadêmico e individual neste momento; criar formulários de bug e feature agora adicionaria manutenção sem uso comprovado.

### 4.9 Proteção da branch como etapa manual

A proteção da `main` é uma configuração do GitHub, não um arquivo do repositório. Como ainda não existe remoto configurado nem GitHub CLI autenticado, a regra não pode ser aplicada nesta rodada.

O procedimento foi documentado em `CONTRIBUTING.md` e repete os checks exatos da CI. A entrega é considerada concluída localmente; a comprovação remota depende da publicação.

---

## 5. Estrutura criada

```text
.
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml
├── .gitattributes
├── .gitignore
├── CONTRIBUTING.md
├── backend/
│   └── ...                         # inalterado nesta entrega
├── frontend/
│   └── ...                         # inalterado nesta entrega
└── docs/
    ├── entregas/
    │   ├── README.md
    │   ├── entrega-01-testes-de-integracao.md
    │   └── entrega-02-git-ci.md
    └── ...
```

O `frontend/.gitignore` existente foi preservado. O `.gitignore` da raiz complementa a higiene para todo o repositório.

---

## 6. Pipeline de CI

### 6.1 Gatilhos e controle

O workflow roda:

- em push para `main`;
- em pull request direcionado a `main`;
- manualmente por `workflow_dispatch`.

Configurações de segurança e eficiência:

- permissão de leitura do conteúdo (`contents: read`);
- concorrência por workflow e ref, com cancelamento de execução anterior;
- timeouts explícitos por job;
- cache de Maven e npm;
- nenhuma credencial persistente ou segredo real.

### 6.2 Job de backend

| Item | Configuração |
| --- | --- |
| Runner | `ubuntu-latest` |
| Serviço | PostgreSQL 17 com health check |
| Java | Temurin 21 |
| Cache | Maven |
| Comando | `mvn -B test` em `backend/` |
| Artefato | `backend/target/surefire-reports/` |
| Retenção | 7 dias |

O job reproduz o banco e as variáveis da suíte da Entrega 01. Um banco limpo é criado no runner, o Flyway aplica V1 e V2 e a classe base restaura a demo antes de cada teste.

### 6.3 Job de front-end

| Item | Configuração |
| --- | --- |
| Runner | `ubuntu-latest` |
| Node.js | 22 |
| Cache | npm, usando `frontend/package-lock.json` |
| Instalação | `npm ci` em `frontend/` |
| Build | `npm run build` em `frontend/` |
| Artefato | `frontend/dist/` |
| Retenção | 7 dias |

`npm ci` foi escolhido em vez de `npm install` por respeitar o lockfile, falhar quando há divergência e produzir instalação reproduzível. Dependências de desenvolvimento não são publicadas como artefato.

### 6.4 Checks obrigatórios

Os nomes exibidos no GitHub são:

- **Backend - testes de integração**;
- **Front-end - qualidade e build**.

Esses são os nomes que devem ser selecionados na proteção da `main`. O check de front-end foi renomeado na Entrega 03, quando passou a executar lint e formatação antes do build.

---

## 7. Higiene do repositório

O `.gitignore` cobre:

| Categoria | Exemplos |
| --- | --- |
| Java/Maven | `backend/target/`, `*.class`, crash logs da JVM |
| Node/Vite | `frontend/node_modules/`, `frontend/dist/`, `.vite`, coverage, caches de lint |
| Ambiente | `.env`, `.env.*`, configurações locais do Spring |
| Banco local | `pgdata/`, `*.pid`, `pgdata.log`, dumps e backups |
| Logs e temporários | `*.log`, `*.tmp`, arquivos de troca |
| IDEs | `.idea`, `.vscode`, configurações Eclipse/STS |
| Windows/macOS | `Thumbs.db`, `.DS_Store`, `Desktop.ini` |
| Ferramentas portáteis | `.tools/`, `.local/` |

O `.gitattributes` completa a higiene ao normalizar line endings e identificar binários. O `frontend/.gitignore` continua válido para quem trabalha apenas na pasta do front-end.

Validação realizada com `git check-ignore`:

```text
.gitignore:2:/backend/target/        backend/target/classes
frontend/.gitignore:1:node_modules   frontend/node_modules/vite
frontend/.gitignore:2:dist           frontend/dist/index.html
.gitignore:23:.env                   .env
```

Nenhum arquivo versionado corresponde a `node_modules`, `target`, `dist`, `.env`, logs, classes ou JARs.

---

## 8. Fluxo de contribuição

O guia completo está em [`CONTRIBUTING.md`](../../CONTRIBUTING.md). O resumo é:

1. trabalhar em branch curta criada a partir de `main`;
2. usar Conventional Commits em pt-BR;
3. validar backend e front-end localmente;
4. abrir pull request com o template preenchido;
5. aguardar os dois checks da CI;
6. fazer squash merge somente com os checks verdes.

O guia também cobre preparação do PostgreSQL, criação dos bancos, comando de teste, variáveis, migrações aditivas, proibição de segredos e solução de problemas comuns.

---

## 9. Validações realizadas

### 9.1 Backend com as variáveis da CI

O `backend/target` foi removido para simular um checkout limpo. A suíte foi executada com JDK 21 portátil, Maven 3.9.16 e as mesmas variáveis do workflow.

```bash
mvn -B test
```

Resultado:

```text
Tests run: 24, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

| Classe | Testes | Tempo |
| --- | --- | --- |
| `AccountIntegrationTest` | 8 | 28,77 s |
| `AuthIntegrationTest` | 9 | 2,81 s |
| `HealthAndCatalogIntegrationTest` | 3 | 0,75 s |
| `NotificationIntegrationTest` | 4 | 1,78 s |

A execução completa, incluindo compilação limpa e inicialização do contexto, levou 101,6 s. Esse tempo é compatível com o limite de 20 minutos do job.

4 relatórios Surefire foram gerados em `backend/target/surefire-reports`, prontos para o upload da CI.

### 9.2 Front-end

No diretório `frontend/`:

```bash
npm ci
npm run build
```

Resultado:

- 28 pacotes instalados;
- 29 pacotes auditados;
- 0 vulnerabilidades;
- Vite 8.3.8;
- 81 módulos transformados;
- build concluído em 1,70 s;
- 19 arquivos gerados em `dist/`, totalizando 947.378 bytes;
- `npm ci` + build levaram 32,2 s no total.

O `package-lock.json` não foi alterado pela instalação.

### 9.3 Validação do workflow

| Ferramenta | Resultado |
| --- | --- |
| `yaml-lint` | YAML válido |
| `actionlint 1.7.12` | Nenhum erro de sintaxe ou expressão |
| Revisão das actions | Majors `checkout@v7`, `setup-java@v6`, `setup-node@v7` e `upload-artifact@v7` confirmados no GitHub |

A execução real no GitHub Actions ainda não ocorreu porque o repositório não foi publicado.

### 9.4 Repositório

| Item | Resultado |
| --- | --- |
| Branch inicial | `main` |
| Commit raiz | `3ab50c7a8204687219a35e4031f67f025b5e4ac2` |
| Arquivos versionados | 184 |
| Artefatos proibidos no índice | Nenhum |
| `.gitignore` validado | Sim, com `git check-ignore` |
| Identidade | `serafim-ozy <leonarddo.serafim@gmail.com>` |
| Tamanho dos objetos | 26,38 MiB em 235 objetos soltos após o commit de implementação |

### 9.5 Bancos após a validação

| Banco | Usuários | Tentativas | Lições | Notificações |
| --- | --- | --- | --- | --- |
| `digitacourse` | 1 | 21 | 6 | 4 |
| `digitacourse_test` | 1 | 21 | 6 | 4 |

O banco de teste terminou apenas com `marina@digitacourse.com`. O banco de desenvolvimento permaneceu intacto.

---

## 10. Publicação no GitHub

Estes passos são manuais e ficaram pendentes porque o ambiente não possui remote nem GitHub CLI autenticado:

1. criar um repositório vazio no GitHub, sem README, `.gitignore` ou licença;
2. adicionar o remoto:
   ```bash
   git remote add origin https://github.com/<usuario>/<repositorio>.git
   ```
3. publicar a branch:
   ```bash
   git push -u origin main
   ```
4. abrir **Settings → Actions → General** e permitir GitHub Actions;
5. abrir **Settings → Branches** e criar a regra de proteção da `main`;
6. exigir pull request, os checks **Backend - testes de integração** e **Front-end - qualidade e build**, branch atualizada e bloqueio de force push/exclusão;
7. abrir um pull request de teste para confirmar que os dois jobs rodam e que um check vermelho impede o merge.

O passo a passo está em [`CONTRIBUTING.md`](../../CONTRIBUTING.md), seção **Proteção da branch main**.

---

## 11. Limitações e riscos

- A CI está configurada, mas ainda não foi executada no GitHub.
- A proteção da `main` ainda não está ativa; o critério de bloqueio de merge só pode ser comprovado após a publicação.
- Um badge de CI não foi adicionado porque exigiria um remoto público estável.
- A CI usa o Maven instalado no runner `ubuntu-latest`; não há Maven Wrapper. Se a versão do runner mudar, o build pode precisar de wrapper ou container fixo.
- O Node.js local pode ser mais novo que o Node.js 22 da CI; o lockfile e o Vite são compatíveis com ambos.
- O workflow não faz lint nesta entrega; lint e formatação foram adicionados na Entrega 03. Testes de front-end, E2E, deploy e release continuam em entregas posteriores.
- Templates de issue não foram criados nesta rodada.
- A chave JWT padrão de desenvolvimento continua no `application.yml`; a externalização e a proteção de segredos pertencem à Entrega 11.

---

## 12. Critérios de aceite

- [x] O projeto tem histórico Git íntegro, branch `main` e nenhum dado local versionado.
- [x] A CI está configurada para rodar em push e pull request.
- [x] O job de backend sobe PostgreSQL 17, configura JDK 21 e executa os 24 testes da Entrega 01.
- [x] O job de front-end executa `npm ci` e `npm run build` com Node.js 22.
- [ ] Uma falha de teste ou build bloqueia o merge — **pendente de ativação da branch protection no GitHub**.
- [x] O fluxo está documentado no README, no `CONTRIBUTING.md` e neste arquivo.

Cinco dos seis critérios foram verificados localmente. O último depende de uma configuração remota que não pode ser aplicada sem publicar o repositório.

---

## 13. Arquivos entregues

| Arquivo | Função |
| --- | --- |
| `.gitignore` | Higiene de Java, Node, ambientes, logs, banco local, IDEs e SO |
| `.gitattributes` | Normalização de line endings e tratamento de binários |
| `.github/workflows/ci.yml` | Pipeline de backend e front-end |
| `.github/pull_request_template.md` | Checklist de revisão |
| `CONTRIBUTING.md` | Fluxo de branches, commits, PRs, checks e branch protection |
| `docs/entregas/entrega-02-git-ci.md` | Este documento |
| `docs/entregas/README.md` | Roadmap atualizado |
| `README.md` | Status, estrutura, CI e próximos passos |
| `backend/README.md` | Testes, CI e limites atualizados |
| `docs/README.md` | Índice de entregas e estrutura atualizados |

Nenhum arquivo de código de produção, migração ou teste foi alterado. O `frontend/.gitignore` existente foi mantido.

---

## 14. Próximos passos

1. Publicar o repositório no GitHub, executar a CI pela primeira vez e ativar a proteção da `main`.
2. **Entrega 03:** adicionar ESLint, Prettier e `.editorconfig` ao front-end, executando lint na CI — concluída em 25/11/2026.
3. **Entrega 04:** adicionar testes de componentes e E2E.
4. Manter `mvn -B test` e `npm run build` verdes em todas as entregas seguintes.

---

## 15. Histórico

| Data | Evento |
| --- | --- |
| 24/11/2026 | `.gitignore`, `.gitattributes` e workflow de CI criados |
| 24/11/2026 | Template de pull request e `CONTRIBUTING.md` criados |
| 24/11/2026 | `mvn -B test` aprovado com 24/24 usando as variáveis da CI |
| 24/11/2026 | `npm ci` e `npm run build` aprovados no front-end |
| 24/11/2026 | Workflow validado com `yaml-lint` e `actionlint` |
| 24/11/2026 | Repositório inicializado em `main` e commit `3ab50c7` criado |
| 24/11/2026 | Documentação da entrega publicada |
