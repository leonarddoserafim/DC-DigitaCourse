# Etapa 01 — Página inicial

| Campo | Valor |
| --- | --- |
| **Status** | Concluída |
| **Data** | 19/11/2026 |
| **Entrega** | Landing page pública estática |
| **Rota** | `/` (página única) |
| **Stack** | React 18 + Vite 8 + CSS puro |
| **Idioma** | Português (pt-BR) |

---

## 1. Objetivo

Tirar o DigitaCourse do papel com uma primeira entrega visível e publicável: a página inicial do produto.

Nesta etapa, o objetivo não foi implementar funcionalidades de treinamento, mas:

- apresentar a proposta do produto;
- validar a identidade visual e a direção de interface;
- construir uma base de front-end organizada para as próximas etapas;
- entregar uma página responsiva, acessível e com metadados básicos de publicação.

---

## 2. Contexto do projeto

O DigitaCourse é uma plataforma de treinamento de digitação proposta como projeto acadêmico na Fatec Praia Grande, na Baixada Santista (SP). A visão do produto é acompanhar o usuário do primeiro contato com o teclado até a fluência, combinando trilhas guiadas, exercícios interativos e feedback em tempo real.

O escopo planejado para o produto completo inclui:

- autenticação e perfis de usuário;
- trilhas, cursos e lições;
- exercícios de digitação com correção;
- métricas de velocidade (WPM) e precisão;
- histórico de progresso;
- gamificação (XP, níveis, sequências e conquistas);
- notificações.

A arquitetura planejada prevê front-end React, API Spring Boot e banco PostgreSQL. **Nada disso está implementado nesta etapa.** A Etapa 01 cobre exclusivamente a camada pública de apresentação.

---

## 3. Escopo entregue

### Incluído

- Página inicial estática em React, sem back-end.
- Layout responsivo para desktop, tablet e celular.
- Navegação por âncoras entre as seções.
- Header sticky com menu mobile.
- Mockups ilustrativos de prática e de painel de evolução.
- FAQ em acordeão nativo.
- Animações de entrada com respeito a `prefers-reduced-motion`.
- CTAs de cadastro/login com aviso provisório de "Em breve".
- Metadados de SEO, Open Graph, Twitter Card e favicon.

### Deliberadamente fora de escopo

- Cadastro, login e recuperação de senha.
- Back-end, banco de dados e API.
- Roteamento entre páginas.
- Trilhas, lições e motor de exercícios.
- Cálculo real de WPM/precisão.
- Persistência de progresso, XP ou conquistas.
- Notificações, e-mails e integrações.
- Painel administrativo.
- Analytics, cookies e deploy configurado.

---

## 4. Decisões tomadas

### 4.1 "Página inicial" como landing page pública

Como ainda não existe aplicação funcional, a página inicial foi interpretada como a landing page de apresentação do produto. Ela comunica a proposta, mostra como o treino funcionará e prepara o terreno para o cadastro futuro.

### 4.2 CTAs sem fluxos fictícios

Os botões de cadastro/login não simulam telas inexistentes nem redirecionam para formulários falsos. Ao clicar, exibem um toast:

> **Em breve** — O cadastro e o acesso à plataforma serão liberados nas próximas etapas do projeto.

Essa escolha mantém a página honesta e evita promessas que o produto ainda não cumpre.

### 4.3 Sem roteador nesta etapa

Como existe apenas uma página e a navegação é feita por âncoras, não foi adicionado React Router. A dependência poderá entrar quando houver telas de autenticação, trilhas e painel.

### 4.4 CSS puro com design tokens

Foi preferido CSS puro, organizado por variáveis, em vez de uma biblioteca de componentes ou utilitários. Isso mantém o pacote enxuto e dá controle total sobre a identidade visual, além de não exigir dependências extras nesta fase.

### 4.5 Fontes self-hosted

As fontes Sora (títulos), Inter (texto) e JetBrains Mono (rótulos e métricas) são empacotadas via Fontsource. Não há requisição a CDNs externos, o que melhora privacidade, previsibilidade e desempenho.

### 4.6 Ícones em SVG inline

Os ícones são componentes React com SVG inline. Não há biblioteca de ícones, o que reduz dependências e permite controlar tamanho, traço e cor por `currentColor`.

### 4.7 Identidade visual derivada dos documentos do projeto

A direção visual reaproveita a linguagem dos documentos de planejamento: papel creme, azul-petróleo, verde-menta, tipografia editorial e o motivo de teclas/keycaps. O resultado aproxima a página do universo de digitação sem cair em clichês de "curso online".

---

## 5. Stack e dependências

| Item | Versão | Papel |
| --- | --- | --- |
| Node.js (ambiente de teste) | 24.14.0 | Execução local e build |
| React | 18.3.1 | Componentização da interface |
| React DOM | 18.3.1 | Renderização no navegador |
| Vite | 8.3.8 | Dev server e build |
| @vitejs/plugin-react | 6.3.0 | Suporte a JSX/Fast Refresh |
| @fontsource-variable/inter | 5.3.0 | Fonte de texto |
| @fontsource-variable/sora | 5.3.0 | Fonte de títulos |
| @fontsource-variable/jetbrains-mono | 5.3.0 | Fonte monoespaçada |

Requisito prático: Node.js 20 ou superior. O projeto usa ES Modules (`"type": "module"`).

---

## 6. Estrutura criada

```text
frontend/
├── index.html                     # Shell HTML, metadados e flag has-js
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── public/
│   ├── favicon.svg
│   └── og-image.jpg               # Imagem 1200×630 para compartilhamento
└── src/
    ├── main.jsx                   # Bootstrap do React e importação das fontes
    ├── App.jsx                    # Composição da página, toast e live region
    ├── components/
    │   ├── Navbar.jsx             # Header sticky e menu mobile
    │   ├── Logo.jsx               # Marca DigitaCourse
    │   ├── Hero.jsx               # Primeira dobra e CTAs
    │   ├── PracticeCard.jsx       # Mockup do exercício de digitação
    │   ├── Marquee.jsx            # Faixa animada de palavras-chave
    │   ├── Features.jsx           # Bento de recursos
    │   ├── HowItWorks.jsx         # Jornada em três passos
    │   ├── ProgressSection.jsx    # Painel escuro de evolução
    │   ├── Faq.jsx                # Dúvidas frequentes
    │   ├── FinalCta.jsx           # Chamada final e teclado decorativo
    │   ├── Footer.jsx             # Rodapé
    │   ├── SectionHeading.jsx     # Cabeçalho reutilizável de seção
    │   ├── Toast.jsx              # Aviso provisório de "Em breve"
    │   └── Icons.jsx              # Coleção de ícones SVG
    ├── hooks/
    │   └── useReveal.js           # IntersectionObserver das animações
    └── styles/
        └── global.css             # Design system, layout e responsividade
```

---

## 7. Seções da página

### 7.1 Header / navegação

- Logo clicável que volta ao topo (`#top`).
- Links para `#recursos`, `#como-funciona`, `#progresso` e `#duvidas`.
- Botões "Entrar" e "Começar agora" (ambos abrem o toast).
- Header sticky, com fundo translúcido e desfoque após o scroll.
- Abaixo de 960 px, os links e ações são substituídos por um botão hambúrguer.
- O menu mobile fecha ao clicar em um link, ao clicar em um CTA ou ao pressionar `Esc`.

### 7.2 Hero

- Eyebrow "Treino de digitação · do zero à fluência".
- Título "Suas ideias merecem dedos mais rápidos." com destaque em verde-menta e cursor piscante.
- Texto de apoio sobre trilhas, exercícios e feedback.
- CTA primário "Começar a praticar" (toast) e secundário "Ver como funciona" (âncora).
- Prova rápida: sem instalar nada, sessões de 10 minutos, direto no navegador.
- Mockup de uma sessão de prática com:
  - barra de janela e cronômetro;
  - nível, título da lição e progresso;
  - trecho de digitação com caractere atual destacado;
  - métricas de velocidade, precisão e sequência;
  - teclado com teclas home `F` e `J` evidenciadas;
  - selo flutuante de XP.
- Keycaps decorativas `F` e `J` ao fundo, remetendo às teclas de orientação.

### 7.3 Marquee

Faixa horizontal com as palavras "Velocidade", "Precisão", "Consistência", "Conquistas", "Foco" e "Fluência", repetidas em loop. É puramente decorativa (`aria-hidden`).

### 7.4 Recursos (`#recursos`)

Bento grid com cinco cartões:

1. **Trilhas que respeitam seu ritmo** — mapa visual Base → Palavras → Frases → Textos.
2. **Feedback em tempo real** — medidor circular de 72 WPM (SVG) e linha de digitação com erro/cursor.
3. **Sessões curtas** — destaque para "10 min por dia".
4. **Recompensas com propósito** — chips de nível, sequência e XP.
5. **Seu progresso, sempre visível** — gráfico de área em SVG e variação de +18%.

### 7.5 Como funciona (`#como-funciona`)

Três passos numerados:

1. Descubra seu ponto de partida.
2. Pratique todos os dias.
3. Acompanhe a evolução.

Cada passo tem ícone, descrição e uma pista curta ("Nível iniciante", "10 minutos por dia", "Progresso visível"). Um aviso final reforça que constância vence intensidade.

### 7.6 Evolução (`#progresso`)

Seção escura com:

- título e texto sobre acompanhar métricas;
- lista de benefícios;
- painel ilustrativo "Meu progresso", com gráfico de velocidade média em SVG, precisão, tempo de prática e sequência;
- chips de conquistas;
- selo flutuante de novo recorde (76 WPM), oculto no mobile.

O gráfico é um mockup estático, não uma visualização de dados reais.

### 7.7 Dúvidas (`#duvidas`)

Cinco perguntas em `<details>`/`<summary>` nativos. A primeira já vem aberta. O conteúdo aborda pré-requisitos, tempo diário, significado de WPM/precisão, uso no celular e disponibilidade do cadastro.

### 7.8 Chamada final

Painel escuro com o título "Sua próxima tecla pode ser o começo.", botão "Quero começar" (toast), link para revisar os recursos e um teclado decorativo em CSS.

### 7.9 Rodapé

- Marca e descrição curta.
- Navegação pelas seções.
- Contexto acadêmico: Fatec Praia Grande, Baixada Santista, projeto em desenvolvimento.
- Direitos autorais e link "Voltar ao topo".

### 7.10 Toast

Aviso temporário exibido por 4,6 segundos. O componente visual é `aria-hidden`; o mesmo conteúdo é anunciado por uma região `role="status"` com `aria-live="polite"` no `App`, evitando leitura duplicada.

---

## 8. Design system

### 8.1 Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `--ink` | `#0c1f2e` | Texto principal, botões, fundos escuros |
| `--ink-2` | `#102a43` | Superfícies escuras secundárias |
| `--ink-3` | `#17384d` | Detalhes sobre fundo escuro |
| `--paper` | `#f6f2e9` | Fundo principal |
| `--paper-deep` | `#efe8da` | Fundos alternativos |
| `--surface` | `#fffdf8` | Cartões e superfícies claras |
| `--teal` | `#0f766e` | Marca, links e destaques |
| `--teal-bright` | `#14b8a6` | Apoio gráfico |
| `--mint` | `#7ee0c3` | Destaques, botões e cursor |
| `--mint-soft` | `#dff7ec` | Fundos suaves |
| `--amber` | `#e9a83a` | Acentos pontuais |
| `--coral` | `#dc5a3c` | Acentos pontuais |
| `--muted` | `#526571` | Texto secundário |
| `--muted-2` | `#6d7d87` | Legendas e rótulos |

### 8.2 Tipografia

| Fonte | Papel |
| --- | --- |
| **Sora Variable** | Títulos, números de destaque e marca |
| **Inter Variable** | Texto corrido, botões e navegação |
| **JetBrains Mono Variable** | Eyebrows, rótulos técnicos, métricas e atalhos |

Títulos usam `letter-spacing` negativo e peso 700. Rótulos mono usam caixa alta e espaçamento ampliado.

### 8.3 Layout e formas

- Container máximo: `1180px`.
- Gutters: `48px` no desktop, `32px` até 640 px.
- Raios: `10px` a `32px`.
- Sombras suaves em três níveis.
- Textura de grão fixa e sutil sobre o papel.
- Linhas, grids e glows radiais em verde-menta/teal nos fundos.
- Motivo recorrente de keycaps, especialmente `F` e `J`.

### 8.4 Componentes base

- Botões: primário, outline, ghost, mint e on-dark, com tamanhos `sm` e `lg`.
- Chips, pills, eyebrows e ícones em cápsula.
- Cartões com borda fina e fundo levemente translúcido.
- Cabeçalhos de seção padronizados (`SectionHeading`).

---

## 9. Responsividade

| Breakpoint | Principais ajustes |
| --- | --- |
| até 1100 px | Redução de gaps no hero, recursos e painel de evolução |
| até 1024 px | Hero em coluna única; bento em 2 colunas; painel de evolução empilhado |
| até 960 px | Menu desktop oculto e hambúrguer ativo; cabeçalhos de seção empilhados; FAQ e CTA em coluna única |
| até 800 px | Recursos e passos em coluna única; rodapé em 2 colunas |
| até 640 px | Container de 32 px; CTAs do hero e do CTA final em largura total; keycaps decorativas ocultas; cartão de prática sem rotação; painel de estatísticas em 2 colunas; selo de recorde oculto; rodapé em 1 coluna |
| até 420 px | Título do hero reduzido; teclado do CTA com rotação menor; selo de XP oculto; gráfico com altura mínima garantida |

Além dos breakpoints, foram aplicados `min-width: 0` em grids e flex items para impedir estouro horizontal de gráficos, teclados e cartões.

### Registros visuais

**Desktop (1440 px)**

![Página inicial em desktop](../assets/etapa-01/desktop.jpg)

**Tablet (1024 px)**

![Página inicial em tablet de 1024 px](../assets/etapa-01/tablet-1024.jpg)

**Tablet (768 px)**

![Página inicial em tablet de 768 px](../assets/etapa-01/tablet-768.jpg)

**Mobile (390 px)**

![Página inicial em mobile](../assets/etapa-01/mobile.jpg)

**Menu mobile aberto**

![Menu mobile aberto](../assets/etapa-01/mobile-menu.png)

**Toast de funcionalidade futura**

![Toast Em breve após clicar em Entrar](../assets/etapa-01/mobile-toast.png)

---

## 10. Acessibilidade

Práticas aplicadas:

- `lang="pt-BR"` no documento.
- Link "Pular para o conteúdo" visível ao receber foco.
- Estrutura semântica com `header`, `nav`, `main`, `section`, `footer`.
- Um único `h1`; seções com `h2` associados por `aria-labelledby` e subtítulos em `h3`.
- Botões reais para ações e âncoras reais para navegação.
- Ícones decorativos com `aria-hidden="true"` e `focusable="false"`.
- Gráfico principal com `role="img"` e descrição textual.
- Menu mobile com `aria-expanded`, `aria-controls` e fechamento por `Esc`.
- FAQ construído com `details`/`summary`, navegável por teclado sem JavaScript adicional.
- Foco visível global e cor de foco adaptada para as seções escuras.
- Toast anunciado por região `aria-live="polite"` separada.
- Animações desativadas ou reduzidas via `prefers-reduced-motion`.
- Conteúdo permanece visível sem JavaScript: a opacidade inicial das animações só é aplicada quando a flag `has-js` está presente.

### Limitações conhecidas

- O menu mobile não prende o foco nem bloqueia o scroll da página; é um dropdown simples, não um modal.
- Não foi executada auditoria automatizada com axe ou Lighthouse nesta etapa. A revisão foi manual, com apoio de capturas em navegador real.
- A textura de grão e alguns elementos decorativos não interferem na leitura, mas devem ser reavaliados em testes com usuários.

---

## 11. Comportamentos e interações

| Interação | Implementação |
| --- | --- |
| Scroll suave entre âncoras | `scroll-behavior: smooth` + links nativos |
| Header muda ao rolar | Listener de scroll adiciona `is-scrolled` após 10 px |
| Menu mobile | Estado React, fecha em link, CTA e tecla `Esc` |
| FAQ | `<details>` nativo, primeira pergunta aberta |
| Toast | Estado no `App`, some após 4,6 s, pode ser reaberto |
| Animações de entrada | `IntersectionObserver` com threshold 0,12 e margem inferior de −48 px |
| Movimento reduzido | Media query + fallback do hook para exibir tudo imediatamente |
| Marquee | Animação CSS em loop, pausada/desativada com movimento reduzido |

Não há persistência de estado, chamadas de rede ou lógica de negócio nesta etapa.

---

## 12. Desempenho e SEO

### Build de produção

Resultado do `npm run build` após os ajustes finais:

| Artefato | Tamanho | Gzip |
| --- | --- | --- |
| JavaScript | 175,98 KB | 54,37 KB |
| CSS | 51,66 KB | 12,83 KB |
| HTML | 2,00 KB | 0,67 KB |

- 33 módulos transformados.
- Fontes divididas em subsets e servidas localmente.
- Nenhuma imagem de conteúdo: os mockups são HTML, CSS e SVG.
- Nenhuma requisição a fontes, ícones ou scripts de terceiros.
- Imagem Open Graph com 1200×630 e cerca de 87 KB.

### SEO e compartilhamento

- `<title>` descritivo.
- `meta description`.
- `meta theme-color`.
- Open Graph (`og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:image` e dimensões).
- Twitter Card `summary_large_image`.
- Favicon SVG.
- `lang="pt-BR"`.

**Pendência para publicação:** `og:image` está com caminho relativo (`/og-image.jpg`). Ao definir o domínio oficial, o ideal é usar URL absoluta e adicionar `canonical` e `og:url`.

---

## 13. Validações realizadas

- [x] `npm install` concluído sem vulnerabilidades reportadas.
- [x] `npm run build` concluído com sucesso.
- [x] Revisão visual em desktop a 1440 px.
- [x] Revisão visual em tablet a 1024 px.
- [x] Revisão visual em tablet a 768 px.
- [x] Revisão visual em mobile a 390 px.
- [x] Menu mobile abre, exibe os links e fecha ao selecionar um item.
- [x] CTA "Entrar" no menu mobile fecha o menu e exibe o toast.
- [x] Região `aria-live` recebe o texto do toast.
- [x] Navegação por âncoras e FAQ verificados no navegador.
- [x] Layout sem rolagem horizontal nos tamanhos testados.

### Correções aplicadas durante a revisão

| Problema encontrado | Correção |
| --- | --- |
| Selo flutuante cobria parte do teclado no mockup | Reposicionamento/remoção do selo sobre o teclado |
| Selo de XP encostava no cartão | Reposicionado acima do cartão |
| Cartão de prática rotacionado causava desconforto no mobile | Rotação removida até 640 px |
| Teclado do CTA estourava a largura em telas pequenas | Keycaps flexíveis, gaps e fontes reduzidos |
| Selo de recorde saía do painel no mobile | Oculto até 640 px |
| Gráficos e grids causavam overflow | `min-width: 0` em grids e flex items |

---

## 14. Como executar e validar

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`.

Para gerar e conferir o build:

```bash
npm run build
npm run preview
```

> **Windows/PowerShell:** se `npm.ps1` estiver bloqueado pela política de execução, use `npm.cmd` nos mesmos comandos.

### Roteiro rápido de verificação

1. Redimensionar a janela entre 1440 px, 1024 px, 768 px e 390 px.
2. Abrir o menu mobile abaixo de 960 px e navegar por uma âncora.
3. Clicar em "Começar a praticar" e conferir o toast.
4. Abrir e fechar as perguntas do FAQ.
5. Ativar "reduzir movimento" no sistema e recarregar a página.
6. Navegar por teclado (`Tab`) e conferir o foco visível e o skip link.

---

## 15. Limitações e provisões

| Limitação atual | Provisão para as próximas etapas |
| --- | --- |
| CTAs abrem toast | Substituir por rotas/fluxos reais de cadastro e login |
| Métricas e gráficos são ilustrativos | Alimentar painéis com dados reais da API |
| Sem back-end | Criar API Spring Boot e banco PostgreSQL |
| Sem roteador | Adicionar rotas quando houver mais de uma tela |
| Toast sem persistência | Manter componente e conectar a mensagens de sistema reais |
| Open Graph com caminho relativo | Configurar domínio, `og:url` e `canonical` no deploy |
| Sem testes automatizados | Adicionar testes de componentes e fluxos críticos |
| Sem lint/formatador configurado | Definir ESLint/Prettier junto ao crescimento do código |
| Menu mobile sem focus trap | Reavaliar se o menu evoluir para painel em tela cheia |

---

## 16. Próximos passos

1. Validar a página com o orientador e ajustar conteúdo/identidade.
2. Publicar uma prévia estática para avaliação.
3. Definir requisitos técnicos da autenticação e do modelo de dados.
4. Estruturar o backend Spring Boot e o PostgreSQL.
5. Implementar cadastro/login e a primeira versão da área do aluno.
6. Construir a primeira trilha e o motor de exercícios.
7. Integrar métricas reais de WPM, precisão e progresso.

---

## 17. Arquivos entregues

| Arquivo | Função |
| --- | --- |
| `frontend/index.html` | Shell HTML, metadados e imagem de compartilhamento |
| `frontend/src/main.jsx` | Bootstrap do React, fontes e CSS global |
| `frontend/src/App.jsx` | Composição da página e estado do toast |
| `frontend/src/components/*` | Seções, marca, ícones e elementos de interface |
| `frontend/src/hooks/useReveal.js` | Animações de entrada com IntersectionObserver |
| `frontend/src/styles/global.css` | Design system, layout, animações e responsividade |
| `frontend/public/favicon.svg` | Favicon da marca |
| `frontend/public/og-image.jpg` | Imagem 1200×630 para compartilhamento |
| `frontend/package.json` | Dependências e scripts |
| `frontend/vite.config.js` | Configuração do Vite |
| `frontend/.gitignore` | Exclusões de build e ambiente |
| `README.md` | Apresentação do projeto e instruções |
| `docs/README.md` | Índice da documentação |
| `docs/assets/etapa-01/*` | Registros visuais da etapa |

---

## 18. Critérios de aceite da etapa

- [x] A página inicial existe e pode ser executada localmente.
- [x] O conteúdo está em português e apresenta o DigitaCourse.
- [x] O layout funciona em desktop, tablet e celular.
- [x] A navegação por âncoras funciona.
- [x] O menu mobile funciona.
- [x] O FAQ funciona sem JavaScript adicional.
- [x] Os CTAs informam que a funcionalidade estará disponível futuramente.
- [x] O build de produção conclui sem erros.
- [x] A documentação da etapa está registrada neste arquivo.
