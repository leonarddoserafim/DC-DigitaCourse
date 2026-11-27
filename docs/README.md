# Documentação — DigitaCourse

Este diretório registra as entregas do projeto por etapa e a trilha de evolução posterior à Etapa 03: o que foi construído, por que cada decisão foi tomada, como validar e o que permanece fora de escopo.

## Etapas

| Etapa | Entrega | Status | Documento |
| --- | --- | --- | --- |
| 01 | Página inicial estática (landing page) | Concluída | [Etapa 01 — Página inicial](etapas/etapa-01-pagina-inicial.md) |
| 02 | Área do aluno com autenticação e dados simulados | Concluída | [Etapa 02 — Área do aluno](etapas/etapa-02-area-do-aluno.md) |
| 03 | Banco de dados, autenticação e persistência | Concluída | [Etapa 03 — Banco de dados](etapas/etapa-03-banco-de-dados.md) |

## Entregas de evolução

O plano pós-Etapa 03 está dividido em 20 entregas, com objetivo, escopo, dependências e critérios de aceite. Cada entrega implementada ganha um documento próprio.

| Entrega | Tema | Status | Documento |
| --- | --- | --- | --- |
| 01 | Testes de integração da API e banco de teste reproduzível | Concluída | [Entrega 01](entregas/entrega-01-testes-de-integracao.md) |
| 02 | Versionamento Git, higiene e pipeline de CI | Concluída localmente | [Entrega 02](entregas/entrega-02-git-ci.md) |
| 03 | Lint, formatação e análise estática do front-end | Concluída localmente | [Entrega 03](entregas/entrega-03-lint.md) |
| 04 | Testes de componentes e E2E dos fluxos críticos | Concluída localmente | [Entrega 04](entregas/entrega-04-testes.md) |
| 05 a 20 | Acessibilidade, contrato, segurança, operação, administração e produto | Planejadas | [Roadmap completo](entregas/README.md) |

As Entregas 02, 03 e 04 foram implementadas e validadas no ambiente local. A publicação do repositório no GitHub, a primeira execução remota da CI e a proteção da branch `main` permanecem como passos manuais.

## Como a documentação está organizada

```text
docs/
├── assets/
│   ├── etapa-01/         # Landing page em desktop, tablet, mobile, menu e toast
│   ├── etapa-02/         # Área do aluno em desktop, mobile, menu, prática e 404
│   └── etapa-03/         # Login, painel, prática, perfil e persistência
├── entregas/
│   ├── README.md         # Análise de gaps e roadmap de 20 entregas
│   ├── entrega-01-testes-de-integracao.md
│   ├── entrega-02-git-ci.md
│   ├── entrega-03-lint.md
│   └── entrega-04-testes.md
├── etapas/
│   ├── etapa-01-pagina-inicial.md
│   ├── etapa-02-area-do-aluno.md
│   └── etapa-03-banco-de-dados.md
└── README.md
```

Cada etapa e cada entrega de evolução devem registrar, no mínimo:

- objetivo e contexto;
- escopo entregue e itens deliberadamente fora de escopo;
- decisões de produto, design e tecnologia;
- arquivos e estrutura criados;
- comportamento da interface e responsividade;
- acessibilidade, desempenho e SEO;
- validações realizadas;
- limitações, provisões e próximos passos;
- critérios de aceite, quando aplicável.

## Contexto do produto

O DigitaCourse é uma plataforma de treinamento de digitação, proposta como projeto acadêmico na Fatec Praia Grande (Baixada Santista/SP). O produto planejado inclui autenticação, trilhas, lições, exercícios interativos, métricas de WPM e precisão, histórico de progresso, gamificação e notificações.

A arquitetura do projeto é composta por front-end React, API Spring Boot e banco PostgreSQL. A Etapa 01 cobre a camada pública de apresentação; a Etapa 02 cobre a experiência do aluno no front-end; a Etapa 03 conecta essa experiência a uma API real, com autenticação JWT, senhas BCrypt e persistência de contas, catálogo, progresso, preferências e notificações no PostgreSQL.

O envio real de e-mail, a recuperação de senha por e-mail e a área administrativa seguem planejados no roadmap de evolução, mas não estão implementados nesta rodada.

## Artefatos de referência

Os documentos de planejamento que orientaram esta entrega (termo de abertura, declaração de escopo, plano de requisitos, documento de arquitetura, EAP e cronograma) foram fornecidos separadamente no início do projeto. O cronograma também está disponível em [`Cronograma_DigitaCourse/`](../Cronograma_DigitaCourse/).
