# Entrega 03 — Lint, formatação e análise estática do front-end

| Campo | Valor |
| --- | --- |
| **Status** | Concluída localmente em 25/11/2026 |
| **Data** | 25/11/2026 |
| **Fase** | Fundação e qualidade |
| **Dependências** | Entrega 02 |
| **Stack** | ESLint 9, Prettier 3, EditorConfig, React 18, Vite 8, Node.js 22 na CI |
| **Commit de implementação** | `0ab5820` (`0ab5820b116daaae9f2c2fa3747144bf83f0b06f`) |
| **Documento mestre** | [Roadmap de 20 entregas](README.md) |

---

## 1. Objetivo

Criar uma base reproduzível de qualidade estática para o front-end: detectar erros de JavaScript, React, hooks e acessibilidade básica antes do build, padronizar a formatação dos arquivos e impedir que código fora do padrão chegue à branch `main`.

A entrega não altera o comportamento do produto. As correções necessárias para zerar o baseline foram feitas sem mudança visual e sem refatoração ampla.

---

## 2. Problema encontrado

Antes desta entrega:

- o front-end não tinha ESLint nem Prettier versionados;
- erros de hooks, imports sem uso e atributos de acessibilidade passavam despercebidos;
- cada arquivo tinha um estilo de quebra de linha e espaçamento diferente;
- não havia `.editorconfig` para alinhar editores;
- a CI executava apenas `npm ci` e `npm run build`, sem análise estática;
- não existia um comando único para verificar ou corrigir o padrão do código.

O baseline inicial do ESLint encontrou **15 erros**, distribuídos entre dependências de hooks, imports e parâmetros sem uso, acessibilidade da superfície de prática e `autoFocus` nas telas de autenticação.

---

## 3. Escopo entregue

- ESLint 9 em configuração flat (`frontend/eslint.config.js`).
- Regras recomendadas de JavaScript, React 18, JSX runtime, hooks e acessibilidade.
- Prettier 3 com configuração compatível com o estilo já usado no projeto.
- `.editorconfig` na raiz para charset, line endings, indentação e espaços finais.
- Scripts `lint`, `lint:fix`, `format` e `format:check`.
- Correção dos 15 erros do baseline sem mudança visual.
- Lint e verificação de formatação no job de front-end da CI.
- Renomeação do check de front-end para **Front-end - qualidade e build**.
- Atualização do template de pull request, `CONTRIBUTING.md`, READMEs e roadmap.
- Documentação das decisões, exceções e resultados.

### Fora de escopo

- Migração para TypeScript.
- Troca de biblioteca de estilos ou adoção de CSS-in-JS.
- Stylelint ou lint de CSS.
- Testes de componentes e E2E, previstos na Entrega 04.
- Auditoria automatizada de acessibilidade com axe, prevista na Entrega 05.
- Pre-commit hooks, Husky, lint-staged ou format-on-save obrigatório.
- Refatoração ampla de componentes ou mudança de comportamento.
- Publicação do repositório e execução remota da CI.

---

## 4. Decisões tomadas

### 4.1 ESLint 9 em vez de ESLint 10

O ESLint 10 já é a versão corrente, mas o `eslint-plugin-jsx-a11y@6.10.2` declara suporte apenas até ESLint 9:

```text
peerDependencies: eslint ^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9
```

Como a acessibilidade JSX é parte central desta entrega, foi adotado `eslint@9.39.5`. O npm emite um aviso de que a linha 9 não é mais suportada oficialmente; o aviso é conhecido e aceito até que o plugin de acessibilidade publique suporte ao ESLint 10.

Alternativas descartadas:

- **ESLint 10 sem `jsx-a11y`:** reduziria o escopo de acessibilidade justamente na entrega que deveria criá-lo.
- **ESLint 10 com instalação forçada:** risco de incompatibilidade não declarada e falhas difíceis de diagnosticar.
- **Biome ou Oxlint:** mudaria o ecossistema e não aproveitaria a integração madura com React e acessibilidade.

### 4.2 Regras de hooks estáveis, sem React Compiler

O `eslint-plugin-react-hooks@7` passou a incluir regras do React Compiler no preset `recommended`, como pureza, imutabilidade, refs e memoização. Ativar esse preset exigiria revisar e possivelmente refatorar vários componentes nesta entrega.

Foram habilitadas apenas as duas regras estáveis e diretamente relacionadas ao escopo:

- `react-hooks/rules-of-hooks`;
- `react-hooks/exhaustive-deps`.

As regras do React Compiler podem ser avaliadas em uma entrega futura, com plano de refatoração e validação visual próprios.

### 4.3 Regras recomendadas de React e acessibilidade

Foram usados os presets:

- `@eslint/js` recommended para JavaScript;
- `eslint-plugin-react` recommended + jsx-runtime;
- `eslint-plugin-jsx-a11y` recommended;
- `eslint-config-prettier` ao final, para desligar regras de estilo que conflitam com o Prettier.

O preset `jsx-runtime` evita exigir `React` em escopo com o JSX automático do Vite. A única regra desativada manualmente é `react/prop-types`, porque o projeto usa JavaScript sem PropTypes e a validação de props não faz parte desta entrega.

### 4.4 Prettier alinhado ao estilo existente

As opções foram escolhidas para reproduzir o estilo que o projeto já usava, reduzindo o diff:

| Opção | Valor | Motivo |
| --- | --- | --- |
| `semi` | `false` | O código já era escrito sem ponto e vírgula |
| `singleQuote` | `true` | O código já usava aspas simples |
| `trailingComma` | `all` | Facilita diffs em listas e objetos |
| `printWidth` | `100` | Próximo da largura já praticada |
| `tabWidth` | `2` | Padrão do projeto |
| `endOfLine` | `lf` | Consistência com a CI Linux e o `.gitattributes` |

`package-lock.json`, `node_modules`, `dist`, `coverage` e `public` ficam fora da formatação por meio de `frontend/.prettierignore`.

### 4.5 `.editorconfig` na raiz

O `.editorconfig` define UTF-8, LF, indentação de dois espaços, linha final e remoção de espaços finais. Exceções:

- Java e SQL usam quatro espaços;
- Markdown preserva espaços finais, úteis em quebras de linha;
- scripts `.bat`, `.cmd` e `.ps1` usam CRLF.

### 4.6 Correções do baseline sem mudança visual

As correções foram limitadas ao necessário para satisfazer as regras:

- memoização de `completedLessons` e `prefs` no `AppContext`, evitando dependências recriadas a cada render;
- remoção do parâmetro `completedLessons` de `buildAchievements`, que não era usado;
- refatoração de `useReveal` para receber uma dependência escalar em vez de um array;
- remoção dos imports `AppIcon` e `CheckCircle`, sem uso;
- troca da superfície de digitação de `<section role="application">` para `<div role="textbox" aria-multiline="true">`, representando melhor uma entrada de texto;
- remoção de `autoFocus` das telas de login, cadastro e recuperação de senha, evitando roubo de foco e desalinhamento com leitores de tela.

O CSS de produção permaneceu com **156,46 kB**, o mesmo tamanho do baseline, e o build continuou com 81 módulos. As demais alterações foram apenas de formatação.

### 4.7 Lint e formatação como gate da CI

O job de front-end passou a executar, nesta ordem:

1. `npm ci`;
2. `npm run lint`;
3. `npm run format:check`;
4. `npm run build`.

O check foi renomeado de **Front-end - instalação e build** para **Front-end - qualidade e build**, refletindo o novo escopo. A ordem falha cedo: lint ou formatação quebrados impedem o build e o merge.

---

## 5. Estrutura criada

```text
.
├── .editorconfig
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml
├── frontend/
│   ├── .prettierignore
│   ├── .prettierrc.json
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── src/                         # código corrigido e formatado
├── docs/
│   └── entregas/
│       ├── README.md
│       ├── entrega-02-git-ci.md
│       └── entrega-03-lint.md
├── CONTRIBUTING.md
├── README.md
└── backend/
    └── README.md
```

Nenhum arquivo do backend, migração ou teste de API foi alterado.

---

## 6. Configuração

### 6.1 ESLint

| Item | Configuração |
| --- | --- |
| Arquivo | `frontend/eslint.config.js` |
| Formato | Flat config |
| Arquivos analisados | `**/*.{js,jsx}` |
| Ambiente | Browser + ES2021; Node apenas para `eslint.config.js` e `vite.config.js` |
| JSX | `ecmaFeatures.jsx: true` |
| React | Versão detectada automaticamente |
| Plugins | `react`, `react-hooks`, `jsx-a11y` |
| Regras de hooks | `rules-of-hooks` e `exhaustive-deps` como erro |
| Prettier | `eslint-config-prettier` por último |
| Ignorados | `dist`, `node_modules`, `coverage` |

### 6.2 Prettier e EditorConfig

| Arquivo | Função |
| --- | --- |
| `frontend/.prettierrc.json` | Regras de formatação do front-end |
| `frontend/.prettierignore` | Exclusões de formatação |
| `.editorconfig` | Padrões globais de editor |

### 6.3 Scripts

| Script | Comando | Função |
| --- | --- | --- |
| `lint` | `eslint . --max-warnings=0` | Falha com erros ou avisos |
| `lint:fix` | `eslint . --fix` | Corrige automaticamente o que for seguro |
| `format` | `prettier . --write` | Formata os arquivos |
| `format:check` | `prettier . --check` | Verifica sem alterar |

### 6.4 CI

O job de front-end em `.github/workflows/ci.yml` ficou assim:

| Etapa | Comando |
| --- | --- |
| Checkout | `actions/checkout@v7` |
| Node.js | `actions/setup-node@v7` com Node.js 22 e cache npm |
| Instalação | `npm ci` |
| Lint | `npm run lint` |
| Formatação | `npm run format:check` |
| Build | `npm run build` |
| Artefato | `frontend/dist/`, retenção de 7 dias |

---

## 7. Correções do baseline

| Problema | Correção | Arquivo |
| --- | --- | --- |
| Dependências de `useMemo`/`useCallback` recriadas a cada render | `completedLessons` e `prefs` passaram a usar `useMemo` | `src/context/AppContext.jsx` |
| Parâmetro `completedLessons` sem uso | Removido de `buildAchievements` e da chamada | `src/lib/metrics.js`, `src/context/AppContext.jsx` |
| Array de dependências dinâmico no efeito | `useReveal` passou a receber uma dependência escalar | `src/hooks/useReveal.js`, `src/App.jsx` |
| Import `AppIcon` sem uso | Removido | `src/pages/PracticePage.jsx` |
| Import `CheckCircle` sem uso | Removido | `src/pages/app/ProgressPage.jsx` |
| Superfície de digitação com papel e interações inadequados | `<div role="textbox" aria-multiline="true">` com teclado e foco | `src/pages/PracticePage.jsx` |
| `autoFocus` em formulários | Removido de login, cadastro e recuperação | `src/pages/auth/*.jsx` |
| Formatação inconsistente | Prettier aplicado em 30 arquivos | `frontend/` |

Resultado: de **15 erros** para **zero erros e zero avisos**.

---

## 8. Validações realizadas

### 8.1 Instalação limpa

```text
npm ci
added 282 packages, and audited 283 packages
found 0 vulnerabilities
```

O npm exibiu o aviso esperado de que `eslint@9.39.5` não está mais na linha oficial de suporte. Tempo aproximado: 100,8 s.

### 8.2 Lint

```text
npm run lint
eslint . --max-warnings=0
```

Resultado: **exit 0**, sem erros ou avisos. Tempo aproximado: 24,1 s.

### 8.3 Formatação

```text
npm run format:check
Checking formatting...
All matched files use Prettier code style!
```

Resultado: **exit 0**. Tempo aproximado: 7,2 s.

### 8.4 Build

```text
vite v8.3.8
✓ 81 modules transformed.
✓ built in 1.85s
```

| Métrica | Resultado |
| --- | --- |
| Arquivos em `dist/` | 19 |
| Tamanho total de `dist/` | 947.383 bytes |
| CSS | 156,46 kB (gzip 29,21 kB) |
| JavaScript | 347,74 kB (gzip 98,73 kB) |
| Tempo do comando | 4,9 s |

O tamanho do CSS permaneceu igual ao baseline, reforçando que a formatação não alterou o visual.

### 8.5 Workflow

| Verificador | Resultado |
| --- | --- |
| `yaml-lint 1.7.0` | YAML válido |
| `actionlint 1.7.12` | Nenhum erro de sintaxe ou expressão |
| `git diff --check` | Nenhum problema de whitespace |

### 8.6 Resumo

| Verificação | Resultado |
| --- | --- |
| `npm ci` | Aprovado |
| `npm run lint` | Aprovado, 0 erros |
| `npm run format:check` | Aprovado |
| `npm run build` | Aprovado |
| Baseline anterior | 15 erros corrigidos |
| Workflow | `yaml-lint` e `actionlint` aprovados |
| Alteração visual | Nenhuma; CSS com o mesmo tamanho |

---

## 9. Como executar

```bash
cd frontend
npm ci
npm run lint
npm run format:check
npm run build
```

Para corrigir automaticamente:

```bash
npm run lint:fix
npm run format
```

Recomenda-se revisar o diff depois do autofix. O lint não deve ser silenciado com `eslint-disable` sem justificativa; o guia está em [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

---

## 10. Limitações e riscos

- O ESLint 9 está fora da linha oficial de suporte e emite aviso no `npm ci`. A migração para ESLint 10 depende de suporte do `eslint-plugin-jsx-a11y`.
- As regras do React Compiler do plugin de hooks não foram ativadas nesta rodada.
- `react/prop-types` está desativada por decisão consciente; o projeto não usa PropTypes.
- Não há Stylelint; o CSS é formatado pelo Prettier, mas não analisado por lint.
- Não há testes de componentes, E2E ou auditoria com axe; esses itens pertencem às Entregas 04 e 05.
- Não há pre-commit hooks; a verificação depende dos scripts locais e da CI.
- A CI foi validada localmente com `actionlint` e `yaml-lint`, mas ainda não executou no GitHub porque o repositório não foi publicado.
- A primeira execução remota e a proteção da `main` continuam como passos manuais da Entrega 02.

---

## 11. Critérios de aceite

- [x] `npm run lint` termina sem erros no código atual.
- [x] `npm run format:check` valida todos os arquivos.
- [x] A CI está configurada para falhar quando lint ou formatação quebram.
- [x] O fluxo de desenvolvimento está documentado.
- [x] Nenhuma regra é desativada em massa sem justificativa.

O critério da CI foi verificado na configuração e nos validadores de workflow. A comprovação em execução remota depende da publicação do repositório.

---

## 12. Arquivos entregues

| Arquivo | Função |
| --- | --- |
| `.editorconfig` | Padrões globais de editor |
| `frontend/eslint.config.js` | ESLint flat com React, hooks e acessibilidade |
| `frontend/.prettierrc.json` | Regras do Prettier |
| `frontend/.prettierignore` | Exclusões de formatação |
| `frontend/package.json` | Scripts e dependências de desenvolvimento |
| `frontend/package-lock.json` | Lockfile reproduzível |
| `.github/workflows/ci.yml` | Lint, formatação e build no job de front-end |
| `.github/pull_request_template.md` | Checklist de lint e formatação |
| `CONTRIBUTING.md` | Fluxo de lint, formatação e check renomeado |
| `README.md` | Status, estrutura, comandos, CI e stack |
| `backend/README.md` | CI e limites atualizados |
| `docs/README.md` | Índice de entregas atualizado |
| `docs/entregas/README.md` | Roadmap e especificação da Entrega 03 |
| `docs/entregas/entrega-02-git-ci.md` | Referências ao check renomeado |
| `docs/entregas/entrega-03-lint.md` | Este documento |
| `frontend/src/**` | Código corrigido e formatado, sem mudança visual |

---

## 13. Próximos passos

1. Publicar o repositório no GitHub, executar a CI pela primeira vez e ativar a proteção da `main` com o check **Front-end - qualidade e build**.
2. **Entrega 04:** adicionar Vitest, React Testing Library e Playwright para testes de componentes e E2E.
3. **Entrega 05:** integrar axe e revisar acessibilidade assistiva.
4. Acompanhar o `eslint-plugin-jsx-a11y` e migrar para ESLint 10 quando houver suporte declarado.

---

## 14. Histórico

| Data | Evento |
| --- | --- |
| 25/11/2026 | ESLint, Prettier e `.editorconfig` configurados |
| 25/11/2026 | Baseline de 15 erros corrigido sem mudança visual |
| 25/11/2026 | 30 arquivos formatados com Prettier |
| 25/11/2026 | `npm ci`, lint, `format:check` e build aprovados |
| 25/11/2026 | Workflow validado com `yaml-lint` e `actionlint` |
| 25/11/2026 | Commit `0ab5820` criado |
| 25/11/2026 | Documentação da entrega publicada |
