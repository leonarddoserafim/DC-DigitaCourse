# Como contribuir — DigitaCourse

Este documento descreve o fluxo de trabalho do DigitaCourse após as Entregas 02, 03 e 04: versionamento, validação local, lint, formatação, testes de componente, E2E, CI e revisão de mudanças.

## Pré-requisitos

- Git;
- JDK 21;
- Maven 3.9+;
- PostgreSQL 17 em `127.0.0.1:5432`;
- Node.js 20.19+ ou 22.12+ com npm (a CI usa Node.js 22);
- Chromium do Playwright para os testes E2E.

As ferramentas podem ser portáteis. No Windows, use `mvn.cmd` e `npm.cmd` caso a política de scripts bloqueie os atalhos `.ps1`.

## Preparar o ambiente

Crie os bancos de desenvolvimento e de teste:

```bash
createdb -h 127.0.0.1 -p 5432 -U postgres digitacourse
createdb -h 127.0.0.1 -p 5432 -U postgres digitacourse_test
```

O banco `digitacourse_e2e` é criado automaticamente por `npm run test:e2e`, desde que o usuário do PostgreSQL tenha permissão para criar bancos.

Instale as dependências do front-end de forma reproduzível e o Chromium do Playwright:

```bash
cd frontend
npm ci
npx playwright install chromium
```

Valide o backend e o front-end antes de abrir um pull request:

```bash
cd backend
mvn -B test

cd ../frontend
npm run test
npm run lint
npm run format:check
npm run build
```

Quando a mudança afetar fluxos de interface, execute também o E2E. Ele exige PostgreSQL, JDK 21 e Maven:

```bash
npm run test:e2e
```

A suíte do backend usa o banco dedicado `digitacourse_test` e restaura a conta demo antes de cada teste. Ela nunca deve apontar para o banco de desenvolvimento `digitacourse`.

Os testes de componente usam Vitest, React Testing Library e jsdom, sem banco ou navegador. A suíte E2E usa Playwright, API real e o banco `digitacourse_e2e`; a demo é restaurada antes e depois de cada teste e as contas `e2e.` são removidas no teardown.

O front-end usa ESLint para React, hooks e acessibilidade, além de Prettier para formatação. Para corrigir automaticamente o que for seguro:

```bash
npm run lint:fix
npm run format
```

O `.editorconfig` na raiz define charset UTF-8, LF, indentação de dois espaços e limpeza de espaços finais para os editores compatíveis.

## Modelo de branches

- `main` é a branch estável e deve permanecer sempre verde.
- Trabalhe em branches curtas criadas a partir de `main`.
- Use nomes descritivos com prefixo: `feat/`, `fix/`, `docs/`, `test/`, `chore/` ou `ci/`.
- Exemplos: `feat/entrega-04-testes`, `fix/login-token-expirado`, `docs/entrega-02`.

O projeto adota um fluxo trunk-based simplificado: branches curtas, pull requests pequenos e integração frequente em `main`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/pt-br/) com assunto curto em pt-BR:

```text
feat: adiciona filtro por período no histórico
fix: corrige renovação da sessão após expiração
test: cobre bloqueio de lição sequencial
docs: documenta a entrega 03 de lint
chore: atualiza dependências de desenvolvimento
ci: publica relatório de testes como artefato
```

Boas práticas:

- Um commit por mudança lógica, com o código e os testes correspondentes.
- Evite misturar refatoração ampla com correção funcional.
- Não versione `backend/target`, `frontend/node_modules`, `frontend/dist`, `.env`, logs, bancos locais ou credenciais.
- Use o corpo do commit para explicar decisões não óbvias e impactos.

## Pull requests

1. Atualize sua branch com `main`.
2. Execute as validações locais do backend e do front-end.
3. Abra o PR contra `main` e preencha o template.
4. Aguarde os três checks da CI: **Backend - testes de integração**, **Front-end - qualidade e build** e **E2E - fluxos críticos**.
5. Corrija falhas antes da revisão final.
6. Faça o merge somente com os checks verdes. A estratégia recomendada é **Squash and merge**, seguida da exclusão da branch.

Pull requests devem ser pequenos, explicar o problema resolvido e incluir evidências de validação. Mudanças de interface precisam preservar a identidade visual, a responsividade e os textos em pt-BR.

## Integração contínua

O workflow está em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) e roda em:

- push para `main`;
- pull requests direcionados a `main`;
- execução manual pela aba **Actions**.

Jobs:

| Check | O que valida |
| --- | --- |
| **Backend - testes de integração** | Sobe PostgreSQL 17 como serviço, configura JDK 21 e executa `mvn -B test` em `backend/` |
| **Front-end - qualidade e build** | Configura Node.js 22 e executa `npm ci`, `npm run test`, `npm run lint`, `npm run format:check` e `npm run build` em `frontend/` |
| **E2E - fluxos críticos** | Sobe PostgreSQL 17, configura JDK 21 e Node.js 22, instala Chromium e executa `npm run test:e2e` em `frontend/` |

Os relatórios Surefire, o conteúdo de `frontend/dist`, o relatório HTML do Playwright e os traces/screenshots de falha são publicados como artefatos por sete dias. O Maven e o npm usam cache entre execuções.

## Proteção da branch main

O repositório local já contém o workflow, mas a proteção da branch é uma configuração do GitHub e depende da publicação do repositório em um remoto. Depois de publicá-lo:

1. Abra **Settings → Branches** no GitHub.
2. Crie uma regra para `main`.
3. Marque **Require a pull request before merging**.
4. Marque **Require status checks to pass before merging**.
5. Selecione **Backend - testes de integração**, **Front-end - qualidade e build** e **E2E - fluxos críticos**.
6. Marque **Require branches to be up to date before merging**.
7. Bloqueie force pushes e exclusão da branch.
8. Se houver mais de uma pessoa no projeto, exija ao menos uma aprovação.

Com essa configuração, uma falha de teste de API, teste de componente, E2E, lint, formatação ou build impede o merge. Enquanto o remoto não existir, essa proteção não pode ser comprovada.

## Regras de código e dados

- Preserve a arquitetura em camadas do backend e os padrões do front-end.
- Valide entradas relevantes no servidor.
- Migrações Flyway são aditivas. Nunca edite uma migração já aplicada; crie `V3__descricao.sql`, `V4__descricao.sql` etc.
- Não registre senhas, tokens ou dados pessoais em logs.
- Segredos devem vir de variáveis de ambiente. Arquivos `.env` são locais e não entram no Git.
- Mudanças de dependência devem manter o `frontend/package-lock.json` sincronizado.
- O front-end segue as regras de `frontend/eslint.config.js` e a formatação de `frontend/.prettierrc.json`.
- Não desative regras de lint em massa. Exceções pontuais precisam de justificativa no código ou na documentação da entrega.
- Evite `eslint-disable` para esconder problemas de hooks ou acessibilidade; prefira corrigir a causa.
- Toda entrega implementada deve ganhar um documento em `docs/entregas/` e atualizar os READMEs afetados.

## Antes de abrir um PR

- [ ] A mudança está no escopo de uma etapa ou entrega.
- [ ] `mvn -B test` passa com 24/24 testes, quando o backend foi alterado.
- [ ] `npm ci`, `npm run test`, `npm run lint` e `npm run format:check` passam, quando o front-end foi alterado.
- [ ] `npm run build` gera o build de produção, quando o front-end foi alterado.
- [ ] `npm run test:e2e` passa com 11/11 testes, quando fluxos de interface foram alterados.
- [ ] A documentação foi atualizada.
- [ ] Não há segredos, dados locais ou artefatos de build no `git status`.
- [ ] O PR descreve como validar e como reverter, se necessário.

## Solução de problemas

| Sintoma | Verificação |
| --- | --- |
| Teste falha antes da limpeza | Confirme que a URL aponta para `digitacourse_test` |
| `Connection refused` no backend | Confirme o PostgreSQL em `127.0.0.1:5432` e o banco `digitacourse_test` |
| Vite reclama da versão do Node | Use Node.js 22.12+ ou 20.19+ |
| `npm ci` falha | Confirme que `frontend/package-lock.json` está atualizado e versionado |
| Lint aponta erro de hook | Corrija dependências ou mova a lógica para fora do efeito; não use `eslint-disable` sem justificativa |
| `format:check` falha | Execute `npm run format` e revise o diff antes de commitar |
| E2E não encontra a API | Confirme PostgreSQL em `127.0.0.1:5432`, JDK 21 e Maven no `PATH` ou em `JAVA_HOME` e `DIGITACOURSE_MAVEN_HOME` |
| Playwright não encontra o navegador | Execute `npx playwright install chromium` em `frontend/` |
| E2E falha por porta ocupada | Feche processos nas portas 8081 e 4173 ou ajuste `DIGITACOURSE_E2E_API_PORT` e `DIGITACOURSE_E2E_WEB_PORT` |
| Teste E2E falha sem detalhes | Abra `npm run test:e2e:report` e inspecione o trace da falha |
| `target` bloqueado no Windows | Feche processos Java e tente novamente; o OneDrive pode atrasar a liberação de arquivos |

## Referências

- [README do projeto](README.md)
- [Roadmap de entregas](docs/entregas/README.md)
- [Entrega 01 — testes de integração](docs/entregas/entrega-01-testes-de-integracao.md)
- [Entrega 02 — Git e CI](docs/entregas/entrega-02-git-ci.md)
- [Entrega 03 — lint e formatação](docs/entregas/entrega-03-lint.md)
- [Entrega 04 — testes de componentes e E2E](docs/entregas/entrega-04-testes.md)
