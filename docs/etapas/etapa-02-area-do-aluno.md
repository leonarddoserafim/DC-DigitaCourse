# Etapa 02 — Área do aluno

| Campo | Valor |
| --- | --- |
| **Status** | Concluída |
| **Data** | 20/11/2026 |
| **Entrega** | Front-end da experiência do aluno, com autenticação e dados simulados |
| **Rotas** | `/entrar`, `/cadastro`, `/recuperar-senha` e `/app/*` |
| **Stack** | React 18 + Vite 8 + React Router 7 + CSS puro |
| **Idioma** | Português (pt-BR) |

> **Nota de continuidade:** este documento registra o estado da Etapa 02 em 20/11/2026. A Etapa 03 substituiu a simulação em `localStorage` por uma API Spring Boot + PostgreSQL, autenticação JWT e persistência real. Consulte a [Etapa 03 — Banco de dados](etapa-03-banco-de-dados.md) para o estado atual.

---

## 1. Objetivo

Construir o restante da experiência do site após a landing page: o caminho completo do aluno, do primeiro acesso à prática de digitação.

Esta etapa teve como objetivo:

- transformar os CTAs da página inicial em fluxos reais de entrada;
- criar cadastro, login e recuperação de senha simulados;
- entregar a área do aluno com painel, trilhas, lições, prática e resultado;
- permitir acompanhar progresso, desafios, conquistas, ranking e notificações;
- oferecer um perfil com metas e preferências;
- validar a experiência em desktop e celular;
- documentar decisões, dados simulados, limites e critérios de aceite.

O foco foi **somente o front-end**. Não há back-end, banco de dados, API ou envio real de e-mail nesta etapa.

---

## 2. Contexto e relação com a Etapa 01

A Etapa 01 entregou a landing page pública, com identidade visual completa, navegação por âncoras e CTAs que apenas exibiam o aviso "Em breve". A Etapa 02 parte dessa base e cria a camada autenticada que a página inicial anunciava.

O que mudou na integração com a landing page:

| Item | Etapa 01 | Etapa 02 |
| --- | --- | --- |
| CTA principal | Toast "Em breve" | Rota `/cadastro` (ou próxima lição, se autenticado) |
| Botão "Entrar" | Toast "Em breve" | Rota `/entrar` |
| Header | Sempre com CTAs públicos | Reconhece a sessão e mostra "Meu perfil" e "Ir para o painel" |
| FAQ | Dizia que cadastro/login chegariam depois | Explica que a conta local já existe nesta etapa |
| Navegação | Uma página com âncoras | Rotas públicas, autenticadas e página 404 |
| Dados | Nenhum | Contas, progresso, tentativas e preferências em `localStorage` |

A identidade visual da landing — papel creme, azul-petróleo, verde-menta, tipografia editorial e motivo de teclas — foi reaproveitada na área do aluno, com uma camada de estilos específica para telas de aplicação.

---

## 3. Escopo entregue

### Incluído

- Cadastro, login, login com conta demo e recuperação de senha simulada.
- Rotas públicas, rotas protegidas e redirecionamento de retorno após o login.
- Shell autenticado com sidebar, topbar, notificações e menu mobile.
- Painel inicial com próxima lição, meta diária, estatísticas, atividade semanal e atalhos.
- Catálogo de três trilhas com doze lições, filtros e progresso individual.
- Detalhe da trilha com módulos, lições bloqueadas/liberadas e histórico de conclusão.
- Motor de prática de digitação processado no navegador, com WPM, precisão, erros, tempo e XP em tempo real.
- Tela de resultado com métricas, recorde, bônus de precisão e próxima lição.
- Página de progresso com gráfico de evolução, heatmap, atividade semanal e histórico de tentativas.
- Desafios diários, semanais e mensais calculados a partir dos dados da conta.
- Mural de oito conquistas com filtros, progresso e próxima conquista.
- Ranking com pódio, tabela, três períodos e opt-out de perfil público.
- Central de notificações com filtros, leitura individual e "marcar todas como lidas".
- Perfil com nome, meta diária, preferências, redefinição de progresso e restauração da conta demo.
- Página 404 integrada ao estado de autenticação.
- Layout responsivo com sidebar off-canvas, menu mobile e modo focado de prática.
- Metadados de página por rota (título e `meta description`).
- Registros visuais em desktop e celular.

### Deliberadamente fora de escopo

- Back-end, API, banco de dados e autenticação real.
- Hash de senha, tokens, cookies de sessão e recuperação por e-mail.
- Envio real de e-mails, notificações push ou integrações externas.
- Integração com pagamentos, matrículas ou instituições.
- Painel administrativo, gestão de alunos, trilhas ou relatórios.
- Ranking real, moderação, anti-fraude ou competição entre contas reais.
- Upload de avatar, edição de e-mail ou exclusão definitiva de conta.
- Testes automatizados versionados, lint e formatador.
- Deploy configurado e fallback de SPA no servidor.

A **área administrativa não foi solicitada** e permanece fora desta entrega.

---

## 4. Decisões tomadas

### 4.1 "Restante do site" como experiência do aluno

O pedido foi interpretado como a jornada do aluno após a landing page, e não como um painel administrativo. Por isso, o escopo cobre autenticação, aprendizado, prática, progresso e comunidade — tudo que o produto promete na página inicial.

### 4.2 Autenticação simulada em `localStorage`

Não existe servidor nesta fase. As contas são salvas em um objeto no `localStorage`, e a sessão guarda apenas o identificador do usuário e a data de entrada.

Decisões de segurança conscientes para um protótipo:

- **senhas não são armazenadas**;
- o login valida apenas se o e-mail existe e se a senha tem quatro ou mais caracteres;
- o cadastro exige seis caracteres, confirmação e aceite dos termos, mas também não persiste a senha;
- não há recuperação real: a tela confirma que o envio foi simulado.

Essa abordagem permite demonstrar todos os fluxos sem criar uma falsa sensação de segurança.

### 4.3 Conta demo pronta para avaliação

Para evitar que a área do aluno abra vazia em uma apresentação, existe uma conta de demonstração com dados completos:

- **E-mail:** `marina@digitacourse.com`
- **Senha:** qualquer valor com 4 ou mais caracteres
- **Atalho:** botão "Entrar com conta de demonstração" na tela de login

A conta também pode ser restaurada pelo perfil, mesmo depois de ter o progresso redefinido.

### 4.4 Prática processada no cliente

O motor de digitação compara cada tecla com o caractere esperado, sem enviar nada para um servidor. Isso torna a demonstração imediata e permite calcular WPM, precisão e XP em tempo real.

Regras aplicadas:

- tecla correta avança o cursor;
- tecla errada soma um erro e pisca o cartão, mas não avança;
- `Backspace` é ignorado;
- teclas modificadoras (`Ctrl`, `Meta`, `Alt`), `Dead` e repetições são ignoradas;
- a barra de espaço é tratada como caractere normal, sem rolar a página;
- o cronômetro começa na primeira tecla correta ou incorreta;
- a lição termina ao acertar o último caractere.

### 4.5 Dados derivados, não duplicados

Progresso, estatísticas, desafios, conquistas e ranking são calculados a partir das tentativas e das lições concluídas. Não existe uma tabela paralela de "XP" ou "nível" que possa ficar inconsistente: tudo é derivado no `AppContext` por funções puras em `src/lib/metrics.js`.

### 4.6 Prática em modo focado

A rota `/app/praticar/:lessonId` fica **fora** do `AppLayout`. Durante o exercício, a sidebar e a topbar desaparecem para reduzir distrações. A tela tem uma barra própria com retorno à trilha, lição atual e indicador de foco.

### 4.7 Ranking fictício e perfil opcional

O ranking usa nove perfis fictícios. O aluno entra na classificação apenas se a preferência `publicProfile` estiver ativa. Quando desativa, seu nome e sua pontuação desaparecem da lista, mas o restante da experiência continua funcionando.

A interface deixa explícito que os demais participantes são fictícios e que nenhum dado real é compartilhado.

### 4.8 Área administrativa fora de escopo

Não há telas de administração, cadastro de trilhas, gestão de usuários ou relatórios. A entrega cobre exclusivamente a experiência do aluno.

### 4.9 CSS separado por contexto

A landing page continua usando `global.css`. A área autenticada, as telas de autenticação e a prática usam `app.css`, importado em `main.jsx`. A separação evita que estilos de aplicação interfiram na página pública e facilita a evolução independente das duas camadas.

### 4.10 Animações com `MutationObserver`

O hook `useReveal` foi ampliado para observar elementos `[data-reveal]` adicionados depois da montagem inicial. Como as páginas do aluno trocam via React Router sem recarregar o documento, o hook agora é chamado no `App` com a rota atual como dependência e registra novos nós automaticamente.

---

## 5. Stack e dependências

| Item | Versão | Papel |
| --- | --- | --- |
| Node.js (ambiente de teste) | 24.14.0 | Execução local e build |
| React | 18.3.1 | Componentização da interface |
| React DOM | 18.3.1 | Renderização no navegador |
| React Router DOM | 7.18.6 | Rotas públicas, protegidas e navegação |
| Vite | 8.3.8 | Dev server e build |
| @vitejs/plugin-react | 6.3.0 | Suporte a JSX/Fast Refresh |
| @fontsource-variable/inter | 5.3.0 | Fonte de texto |
| @fontsource-variable/sora | 5.3.0 | Fonte de títulos |
| @fontsource-variable/jetbrains-mono | 5.3.0 | Fonte monoespaçada |

Requisito prático: Node.js 20 ou superior. O projeto usa ES Modules (`"type": "module"`).

Não foram adicionadas bibliotecas de estado, formulários, gráficos, ícones ou componentes visuais. Tudo continua sendo construído com React, CSS puro e SVG inline.

---

## 6. Rotas e proteção

### 6.1 Mapa de rotas

| Rota | Acesso | Tela |
| --- | --- | --- |
| `/` | Pública | Landing page da Etapa 01 |
| `/entrar` | Pública (somente deslogado) | Login |
| `/cadastro` | Pública (somente deslogado) | Criação de conta |
| `/recuperar-senha` | Pública (somente deslogado) | Recuperação simulada |
| `/app` | Protegida | Painel / visão geral |
| `/app/trilhas` | Protegida | Catálogo de trilhas |
| `/app/trilhas/:courseId` | Protegida | Detalhe da trilha e lições |
| `/app/praticar/:lessonId` | Protegida, fora do shell | Prática em modo focado |
| `/app/progresso` | Protegida | Progresso e histórico |
| `/app/desafios` | Protegida | Desafios |
| `/app/conquistas` | Protegida | Conquistas |
| `/app/ranking` | Protegida | Ranking |
| `/app/notificacoes` | Protegida | Central de notificações |
| `/app/perfil` | Protegida | Perfil e ajustes |
| `*` | Pública | Página 404 |

### 6.2 Regras de acesso

- `ProtectedRoute` (export default) verifica a sessão. Sem conta, redireciona para `/entrar` guardando o caminho de origem em `location.state.from`.
- Após o login, o aluno volta para a rota que tentou abrir.
- `PublicOnlyRoute` (export nomeado) impede que um aluno autenticado veja login, cadastro ou recuperação; nesse caso, redireciona para `/app`.
- A rota de prática também é protegida, mas não usa o `AppLayout`.
- Lições bloqueadas podem ser acessadas por URL direta, mas a própria página mostra um estado de bloqueio em vez do exercício.

### 6.3 Metadados por rota

O hook `usePageMeta` atualiza `document.title` e a `meta description` a cada página. Como o projeto é uma SPA sem renderização no servidor, esses metadados são aplicados no cliente; a landing page mantém as tags estáticas de Open Graph e Twitter Card da Etapa 01.

---

## 7. Estrutura criada

```text
frontend/src/
├── components/
│   ├── app/
│   │   ├── AppLayout.jsx          # Shell autenticado e outlet
│   │   ├── BarChart.jsx           # Atividade semanal
│   │   ├── CourseCard.jsx         # Cartão de trilha
│   │   ├── EmptyState.jsx         # Estados vazios reutilizáveis
│   │   ├── LineChart.jsx          # Gráfico de evolução em SVG
│   │   ├── NotificationItem.jsx   # Item de notificação
│   │   ├── PageHeader.jsx         # Cabeçalho das páginas internas
│   │   ├── ProgressRing.jsx       # Anel de progresso em SVG
│   │   ├── ProtectedRoute.jsx     # Proteção de rotas
│   │   ├── Sidebar.jsx            # Navegação lateral
│   │   ├── StatCard.jsx           # Cartão de estatística
│   │   └── Topbar.jsx             # Barra superior e notificações
│   └── auth/
│       └── AuthLayout.jsx         # Layout das telas de autenticação
├── context/
│   ├── AppContext.jsx             # Conta, sessão, progresso e dados derivados
│   └── ToastContext.jsx           # Avisos temporários
├── data/
│   ├── community.js               # Perfis fictícios do ranking
│   ├── courses.js                 # 3 trilhas e 12 lições
│   └── seed.js                    # Conta demo e conta vazia
├── hooks/
│   ├── usePageMeta.js             # Título e descrição por rota
│   └── useReveal.js               # Animações de entrada
├── lib/
│   ├── format.js                  # Datas, números, minutos e iniciais
│   └── metrics.js                 # Estatísticas, desafios, conquistas e ranking
├── pages/
│   ├── app/
│   │   ├── AchievementsPage.jsx
│   │   ├── ChallengesPage.jsx
│   │   ├── CourseDetailPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ProgressPage.jsx
│   │   └── RankingPage.jsx
│   ├── auth/
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   ├── LandingPage.jsx
│   ├── NotFoundPage.jsx
│   └── PracticePage.jsx
├── styles/
│   ├── app.css                    # Área do aluno, autenticação e responsividade
│   └── global.css                 # Design system e landing page
├── App.jsx                        # Rotas e composição
└── main.jsx                       # Providers, Router e CSS
```

---

## 8. Telas e funcionalidades

### 8.1 Login (`/entrar`)

- E-mail e senha com validação local.
- Botão para mostrar/ocultar a senha.
- Aviso explícito de que a autenticação é simulada e de que qualquer senha com 4+ caracteres é aceita.
- Erros em `role="alert"` para e-mail inexistente, campos vazios ou senha curta.
- Link para recuperação de senha e para cadastro.
- Botão de entrada com a conta demo.
- Layout em duas colunas no desktop: formulário e painel visual com prévia de prática.

### 8.2 Cadastro (`/cadastro`)

- Nome completo, e-mail, senha, confirmação e aceite dos termos.
- Validações: nome com 2+ caracteres, e-mail válido, senha com 6+ caracteres, senhas iguais, termos aceitos e e-mail não duplicado.
- Criação de uma conta vazia com notificação de boas-vindas.
- Entrada automática no painel após o cadastro.
- A senha não é armazenada; o texto da interface deixa isso claro.

### 8.3 Recuperação de senha (`/recuperar-senha`)

- Validação de e-mail.
- Estado de confirmação com a mensagem de que o envio é apenas simulado.
- Nenhum e-mail é enviado e nenhuma senha é alterada.
- Retorno para o login.

### 8.4 Shell autenticado

**Sidebar**

- Navegação para visão geral, trilhas, desafios, progresso, conquistas, ranking e perfil.
- Bloco de nível com XP atual e barra até o próximo nível.
- Identidade do aluno no rodapé e botão de sair.
- Link "Voltar ao site".
- Em telas menores que 960 px, vira um painel off-canvas com fundo escurecido.

**Topbar**

- Breadcrumb da seção atual.
- Meta diária em percentual e sequência de dias.
- Botão de notificações com badge de não lidas e painel suspenso.
- Avatar com iniciais e primeiro nome.
- Botão hambúrguer no mobile.

O shell fecha a sidebar e o painel de notificações ao mudar de rota e ao pressionar `Esc`.

### 8.5 Painel (`/app`)

- Saudação pelo primeiro nome e texto contextual da meta diária.
- Cartão "Continue de onde parou", com trilha, lição, duração, XP, progresso e CTA.
- Anel da meta de hoje, com minutos praticados e restantes.
- Quatro indicadores: velocidade média, precisão, sequência e tempo total.
- Gráfico de atividade dos últimos sete dias.
- Desafio diário com progresso e atalho para praticar.
- Prévia de conquistas.
- Últimas tentativas com data relativa.
- Prévia das trilhas.

### 8.6 Trilhas (`/app/trilhas`)

- Visão geral do avanço na jornada.
- Filtros: todas, em andamento, concluídas e não iniciadas.
- Três cartões de trilha com nível, foco, duração, número de lições, progresso e CTA contextual.
- Estado vazio quando o filtro não retorna resultados.

### 8.7 Detalhe da trilha (`/app/trilhas/:courseId`)

- Cabeçalho da trilha com progresso, duração e número de lições.
- Módulos e lições em ordem.
- Lições bloqueadas até a conclusão da anterior.
- Identificação de lição concluída, atual ou bloqueada.
- Ações para praticar, revisar ou continuar.
- Painel lateral com resumo do progresso e próximo passo.
- URL inválida mostra estado de "trilha não encontrada".

### 8.8 Prática (`/app/praticar/:lessonId`)

- Modo focado, sem sidebar e sem topbar do shell.
- Barra própria com retorno à trilha, título, módulo e indicador de foco.
- Texto da lição com caractere atual, caracteres corretos e erros destacados.
- Estatísticas ao vivo: WPM, precisão, erros e tempo.
- Teclado visual que destaca a próxima tecla esperada.
- Progresso da lição e botão de reinício.
- Feedback visual de erro sem avançar o cursor.
- Estado de lição bloqueada e estado de lição inexistente.
- Ao concluir, registra a tentativa, conclui a lição e abre o resultado.

### 8.9 Resultado

- WPM, precisão, tempo, erros e XP ganho.
- Bônus de 10 XP quando a precisão é igual ou superior a 98%.
- Indicação de novo recorde quando o WPM supera a melhor marca anterior.
- Comparação com a média da conta.
- CTA para a próxima lição do mesmo módulo/trilha, quando existir.
- Opção de repetir a lição ou voltar às trilhas.
- A tentativa gera uma notificação na conta.

### 8.10 Progresso (`/app/progresso`)

- Quatro cartões: velocidade média, precisão média, sequência e tempo total, com variação em relação ao período anterior quando há dados.
- Gráfico de linha das últimas 14 tentativas, alternando entre WPM e precisão.
- Melhor marca e data relativa da última prática.
- Heatmap de oito semanas, com níveis de intensidade por minutos praticados.
- Barras de atividade da semana e meta diária.
- Histórico com lição, trilha, data, WPM, precisão, duração e XP.
- Estados vazios para contas novas.

### 8.11 Desafios (`/app/desafios`)

- Painel de temporada com percentual geral, desafios concluídos, XP disponível e minutos de hoje.
- Seis desafios: dois diários, dois semanais e dois mensais.
- Filtros por período.
- Cada cartão mostra progresso, alvo, recompensa e CTA para praticar.
- Progresso calculado a partir das tentativas reais da conta.
- O percentual geral usa a média do progresso dos desafios arredondada para baixo, evitando exibir 100% quando ainda falta uma meta.

### 8.12 Conquistas (`/app/conquistas`)

- Resumo com anel de conquistas desbloqueadas, XP, nível e lições concluídas.
- Destaque para a conquista mais próxima.
- Filtros: todas, desbloqueadas e em progresso.
- Oito conquistas com ícone, descrição, progresso e recompensa visual.
- Contas novas veem todas em progresso; a conta demo vê as marcas já alcançadas.

### 8.13 Ranking (`/app/ranking`)

- Três períodos: semanal, mensal e geral.
- Pódio com os três primeiros e destaque para o aluno quando está entre eles.
- Tabela com posição, participante, trilha, WPM, precisão e XP do período.
- Nove perfis fictícios e, opcionalmente, o aluno.
- Aviso de que os participantes são fictícios.
- Respeita a preferência de perfil público.

### 8.14 Notificações (`/app/notificacoes`)

- Filtros "Todas" e "Não lidas".
- Contagem de avisos e badge de não lidas.
- Leitura individual ao abrir uma notificação.
- Ação "Marcar todas como lidas".
- Resumo de lidas/não lidas com barra de progresso.
- Preferências de e-mail e resumo semanal aparecem como configuração simulada.
- Notificações são geradas ao concluir/praticar lições, ao redefinir progresso e no cadastro.
- Limite de 30 avisos por conta.

### 8.15 Perfil e ajustes (`/app/perfil`)

- Identidade da conta com iniciais, e-mail, papel, data de entrada e estatísticas.
- Progresso geral da jornada.
- Edição do nome e da meta diária (5, 10, 15 ou 20 minutos).
- E-mail somente leitura, por ser a chave da conta local.
- Preferências: perfil público no ranking, lembretes por e-mail, resumo semanal e meta ativa.
- Salvamento local com confirmação visual e toast.
- Zona de cuidado com confirmação em duas etapas para redefinir progresso ou restaurar a conta demo.
- Logout com retorno à landing page.
- Aviso explícito de que os dados ficam no navegador.

### 8.16 Página 404 (`*`)

- Layout próprio com teclas `4`, `0` e `4`.
- CTAs adaptados: aluno autenticado vai para o painel/trilhas; visitante vai para a home/login.
- Mantém a identidade visual e o contexto acadêmico.

---

## 9. Dados e simulação

### 9.1 Persistência

| Chave | Conteúdo |
| --- | --- |
| `digitacourse:accounts:v1` | Objeto de contas indexado pelo id do usuário |
| `digitacourse:session:v1` | `userId` e `signedInAt` da sessão atual |

Cada conta armazena:

- `user`: id, nome, e-mail, papel e data de entrada;
- `progress`: lições concluídas e tentativas;
- `prefs`: meta diária, perfil público, lembretes e resumo semanal;
- `notifications`: avisos com tipo, link, estado de leitura e data.

Se o armazenamento estiver vazio ou inválido, a conta demo é criada automaticamente. Falhas de `localStorage` são tratadas para que o app continue funcionando em memória.

**Nenhuma senha é salva.**

### 9.2 Conta demo

| Item | Valor |
| --- | --- |
| Nome | Marina Costa |
| E-mail | `marina@digitacourse.com` |
| Senha | Qualquer valor com 4+ caracteres |
| Entrada | Login normal ou botão de demonstração |
| Tentativas | 21 |
| Lições concluídas | 6 de 12 |
| Sequência | 13 dias |
| Meta diária | 10 minutos |
| Notificações | 4 (2 não lidas) |
| Membro desde | 64 dias antes da criação da conta |

Os dados são gerados em relação à data atual, para que o painel, os gráficos e a sequência pareçam recentes em qualquer apresentação.

### 9.3 Trilhas e lições

| Trilha | Nível | Lições | Foco |
| --- | --- | --- | --- |
| Fundamentos do teclado | Iniciante | 4 | Postura, home row e teclas guias |
| Palavras do dia a dia | Intermediário | 4 | Vocabulário, acentuação, números e mensagens |
| Textos com fluência | Avançado | 4 | Frases e parágrafos curtos |

Cada lição tem id, título, descrição, duração, XP, foco e o texto usado no exercício. A conta demo concluiu as quatro lições de Fundamentos e as duas primeiras de Palavras do dia a dia; a próxima é "Mensagens e e-mails".

### 9.4 Regras de progresso

- Uma lição é concluída quando o aluno acerta o último caractere do texto.
- A primeira lição de cada trilha é sempre liberada.
- As demais são liberadas quando a lição anterior da mesma trilha está concluída.
- Refazer uma lição já concluída registra nova tentativa, mas não duplica a conclusão.
- O progresso da trilha é a razão entre lições concluídas e total de lições.

### 9.5 Métricas

- **WPM:** `(caracteres corretos / 5) / minutos decorridos`, arredondado.
- **Precisão:** `caracteres corretos / (caracteres corretos + erros) × 100`.
- **Duração:** tempo entre a primeira tecla e a conclusão, com mínimo de 800 ms.
- **XP da tentativa:** XP da lição + 10 de bônus se a precisão for 98% ou mais.
- **Nível:** `floor(XP total / 500) + 1`.
- **Sequência:** dias consecutivos com pelo menos uma tentativa, contando hoje ou ontem.
- **Médias:** últimos 10 exercícios; a variação compara com os 10 anteriores.
- **Atividade semanal:** minutos por dia nos últimos 7 dias.
- **Heatmap:** 8 semanas, com quatro níveis de intensidade (1, 10, 20 e 30 minutos).

### 9.6 Desafios

Os seis desafios são derivados das tentativas:

| Período | Desafio | Critério |
| --- | --- | --- |
| Diário | Meta diária | Minutos de hoje vs. meta da conta |
| Diário | Precisão cirúrgica | Melhor precisão de hoje ≥ 97% |
| Semanal | Cinco dias de ritmo | Dias ativos nos últimos 7 dias ≥ 5 |
| Semanal | Três lições na semana | Lições distintas nos últimos 7 dias ≥ 3 |
| Mensal | Rumo aos 70 WPM | Melhor WPM dos últimos 30 dias ≥ 70 |
| Mensal | Colecionador de XP | XP dos últimos 30 dias ≥ 1.000 |

Cada desafio tem XP próprio; o painel soma o XP ainda disponível. Na conta demo, 5 de 6 estão concluídos e o percentual geral aparece como 99%, pois "Rumo aos 70 WPM" está em 68 de 70.

### 9.7 Conquistas

| Conquista | Critério |
| --- | --- |
| Primeira tecla | 1 exercício concluído |
| Ritmo constante | 7 dias consecutivos |
| Precisão de ouro | 98% de precisão em um exercício |
| Velocidade 60+ | 60 WPM em um exercício |
| Trilha completa | 100% de uma trilha |
| Explorador | Praticar em 2 trilhas |
| Duas horas de foco | 120 minutos acumulados |
| Mil de XP | 1.000 XP acumulados |

As conquistas são recalculadas a cada tentativa. A conta demo desbloqueia sete das oito; falta "Duas horas de foco", pois acumula cerca de 73 minutos.

### 9.8 Ranking

- Nove participantes fictícios em `src/data/community.js`.
- Períodos semanal (XP dos últimos 7 dias), mensal (30 dias) e geral (XP total).
- O aluno é inserido com seus próprios indicadores quando o perfil público está ativo.
- A ordenação usa o XP do período e, em caso de empate, o WPM.
- Não há chamadas de rede, atualização em tempo real ou moderação.

### 9.9 Notificações

- Geradas localmente ao registrar uma tentativa.
- A primeira conclusão de uma lição usa o título "Lição concluída"; repetições usam "Prática registrada".
- A mensagem inclui WPM, precisão e XP.
- O cadastro cria uma notificação de boas-vindas.
- A redefinição de progresso cria um aviso próprio.
- O painel da topbar mostra as quatro mais recentes; a página completa mostra todas.

---

## 10. Design system da área do aluno

A área autenticada reutiliza os tokens da landing page e acrescenta uma linguagem de aplicação:

- fundo papel com cartões claros e bordas finas;
- sidebar escura em azul-petróleo;
- verde-menta para ação primária, progresso e destaques;
- âmbar para sequência, metas e alertas;
- coral para erros, conquistas específicas e variações;
- teal para precisão e dados secundários;
- tipografia Sora nos títulos, Inter no texto e JetBrains Mono em rótulos, métricas e atalhos;
- anéis, barras e gráficos em SVG/CSS, sem biblioteca externa;
- keycaps e motivo de teclado como elementos decorativos;
- animações de entrada discretas com `data-reveal`.

Componentes reutilizáveis:

| Componente | Uso |
| --- | --- |
| `PageHeader` | Eyebrow, título, descrição e ações das páginas |
| `StatCard` | Indicadores com valor, sufixo, dica e variação |
| `ProgressRing` | Progresso circular acessível |
| `LineChart` | Evolução de WPM/precisão |
| `BarChart` | Atividade semanal |
| `CourseCard` | Trilhas no catálogo e no painel |
| `EmptyState` | Estados vazios e erros de rota |
| `NotificationItem` | Lista e painel suspenso de avisos |
| `AppIcon` | Ícones por nome nas conquistas e desafios |

---

## 11. Responsividade

### 11.1 Breakpoints

| Breakpoint | Principais ajustes |
| --- | --- |
| até 1280 px | Conteúdo e topbar com menos padding; grids principais reduzem colunas |
| até 1120 px | Sidebar mais estreita; estatísticas em 2 colunas; dashboards e páginas em coluna única; asides em 2 colunas |
| até 960 px | Sidebar vira off-canvas com scrim; topbar ganha hambúrguer; autenticação em coluna única; sidebar fechada por padrão |
| até 820 px | Cabeçalhos empilhados; cartões de continuação sem ilustração; desafios, conquistas, perfil e prática em coluna única; resultados centralizados |
| até 700 px | Conteúdo com 16 px de gutter; grids de trilhas/desafios em 1 coluna; lições reorganizadas; pódio e gráficos compactos; prática com teclado reduzido |
| até 540 px | Estatísticas, conquistas e resumo do perfil em 1 coluna; meta diária centralizada; keycaps e detalhes decorativos reduzidos |
| `prefers-reduced-motion` | Animações de página, sidebar, cartões, erro de digitação e indicadores são desativadas |

### 11.2 Registros visuais

As capturas foram geradas em navegador real via Chrome DevTools Protocol, em **1440×1000** (desktop) e **390×844** (mobile).

**Login**

![Tela de login em desktop](../assets/etapa-02/01-login.png)

**Cadastro**

![Tela de cadastro em desktop](../assets/etapa-02/02-cadastro.png)

**Painel do aluno**

![Painel do aluno em desktop](../assets/etapa-02/03-dashboard.png)

**Trilhas**

![Catálogo de trilhas em desktop](../assets/etapa-02/04-trilhas.png)

**Detalhe da trilha**

![Detalhe da trilha em desktop](../assets/etapa-02/05-trilha-detalhe.png)

**Prática em modo focado**

![Prática de digitação em desktop](../assets/etapa-02/06-pratica.png)

**Resultado da prática**

![Resultado da prática em desktop](../assets/etapa-02/07-resultado.png)

**Progresso**

![Página de progresso em desktop](../assets/etapa-02/08-progresso.png)

**Desafios**

![Página de desafios em desktop](../assets/etapa-02/09-desafios.png)

**Conquistas**

![Página de conquistas em desktop](../assets/etapa-02/10-conquistas.png)

**Ranking**

![Ranking em desktop](../assets/etapa-02/11-ranking.png)

**Notificações**

![Central de notificações em desktop](../assets/etapa-02/12-notificacoes.png)

**Perfil**

![Perfil e ajustes em desktop](../assets/etapa-02/13-perfil.png)

**Mobile — painel**

![Painel do aluno em mobile](../assets/etapa-02/14-mobile-dashboard.png)

**Mobile — menu aberto**

![Menu lateral aberto em mobile](../assets/etapa-02/15-mobile-menu.png)

**Mobile — prática**

![Prática de digitação em mobile](../assets/etapa-02/16-mobile-pratica.png)

**404**

![Página 404 em desktop](../assets/etapa-02/17-404.png)

---

## 12. Acessibilidade

Práticas aplicadas:

- `lang="pt-BR"` no documento.
- Link "Pular para o conteúdo" no shell autenticado, apontando para `#app-content`.
- Estrutura semântica com `header`, `nav`, `main`, `section`, `aside` e `footer`.
- Um `h1` por página; títulos internos em `h2`/`h3`.
- Navegação com `NavLink`, indicando a rota atual.
- Botões reais para ações e links reais para navegação.
- Formulários com `<label>`, `autoComplete`, dicas e mensagens de erro em `role="alert"`.
- `aria-invalid` nos campos de login quando há erro.
- Botões de mostrar/ocultar senha com `aria-label` dinâmico.
- Filtros e seletores com `aria-pressed`.
- Painel de notificações com `aria-expanded` e `aria-controls`.
- Sidebar mobile com `aria-label` para abrir/fechar e scrim clicável.
- `ProgressRing` com `role="img"` e `aria-label` textual.
- Gráficos com `role="img"` e resumo dos dados; pontos com `<title>`.
- Ícones decorativos com `aria-hidden="true"` quando não carregam informação.
- Foco visível global, inclusive em botões, links e controles.
- Fechamento de menu/painel com `Esc`.
- Bloqueio do scroll do body enquanto a sidebar mobile está aberta.
- Animações desativadas com `prefers-reduced-motion`.

### Limitações conhecidas

- A sidebar mobile não prende o foco; é um painel off-canvas, não um modal completo.
- O painel de notificações da topbar também não prende o foco.
- Não foi executada auditoria automatizada com axe ou Lighthouse nesta etapa.
- Gráficos têm descrição resumida, mas não uma tabela alternativa completa de dados.
- A prática exige teclado físico; no celular, a tela é responsiva, porém o treino completo não foi desenhado para teclado virtual.

---

## 13. Comportamentos e interações

| Interação | Implementação |
| --- | --- |
| Login | Valida e-mail existente e senha com 4+ caracteres; retorna à rota de origem |
| Login demo | Entra como Marina Costa com dados completos |
| Cadastro | Valida termos, senha e duplicidade; cria conta vazia e entra |
| Recuperação | Simula envio e exibe confirmação |
| Proteção de rota | Redireciona para `/entrar` e preserva o destino |
| Rotas públicas | Usuário logado é enviado para `/app` |
| Sair | Encerra a sessão e volta à landing page |
| Prática | Motor de teclado no cliente, com WPM/precisão ao vivo |
| Conclusão | Registra tentativa, conclui lição, gera notificação e mostra resultado |
| Lição bloqueada | URL direta exibe estado de bloqueio |
| Notificações | Leitura individual, filtro e "marcar todas" |
| Perfil | Salva nome, meta e preferências no `localStorage` |
| Redefinir progresso | Confirmação em duas etapas e recálculo de todos os derivados |
| Restaurar demo | Substitui a conta demo e volta ao painel |
| Ranking | Alterna período e respeita perfil público |
| Sidebar mobile | Abre/fecha, fecha ao navegar, no scrim e com `Esc` |
| Animações | `IntersectionObserver` + `MutationObserver`, com respeito a movimento reduzido |

Não há chamadas HTTP, WebSocket, service worker ou persistência fora do navegador.

---

## 14. Desempenho e SEO

### Build de produção

Resultado do `npm run build` após os ajustes finais:

| Artefato | Tamanho | Gzip |
| --- | --- | --- |
| JavaScript | 349,77 KB | 99,21 KB |
| CSS | 155,39 KB | 28,98 KB |
| HTML | 2,00 KB | 0,67 KB |

- 79 módulos transformados.
- Fontes divididas em subsets e servidas localmente.
- Nenhuma biblioteca de gráficos, ícones ou componentes.
- Nenhuma requisição a fontes, scripts ou APIs de terceiros.
- Nenhuma imagem de conteúdo nas telas: gráficos, anéis, teclados e keycaps são HTML/CSS/SVG.

### SEO e compartilhamento

- A landing page mantém título, descrição, Open Graph, Twitter Card e favicon da Etapa 01.
- Cada rota interna atualiza `document.title` e a `meta description` no cliente.
- A página 404 tem título e descrição próprios.
- Como a aplicação é uma SPA, não há SSR nem tags Open Graph específicas por rota.
- Para publicar, o servidor precisa redirecionar rotas desconhecidas para `index.html`, senão recarregar `/app/trilhas` pode retornar 404 no host.

**Pendência para publicação:** configurar domínio, `canonical`, `og:url` e fallback de SPA no deploy.

---

## 15. Validações realizadas

### 15.1 Build

- [x] `npm.cmd run build` concluído sem erros.
- [x] 79 módulos transformados.
- [x] CSS e JS gerados em `frontend/dist`.

### 15.2 Validação funcional automatizada

Foi usado um script próprio via Chrome DevTools Protocol, com Chrome headless, viewport de 1440×1000 e 390×844. Resultado: **25 de 25 verificações aprovadas**, sem erros de console.

Cobertura:

- [x] Rota `/entrar` é pública.
- [x] Formulário de login presente.
- [x] Rota protegida `/app` redireciona para `/entrar`.
- [x] Rota `/cadastro` é pública.
- [x] Login demo leva ao painel.
- [x] Nome da conta demo é carregado.
- [x] Três cartões de trilha renderizados.
- [x] Lições da trilha renderizadas.
- [x] Tabela de histórico presente.
- [x] Desafios renderizados.
- [x] Conquistas renderizadas.
- [x] Ranking renderizado.
- [x] Notificações renderizadas.
- [x] Formulário de perfil presente.
- [x] Exercício de digitação carregado.
- [x] Resultado da lição exibido.
- [x] Resultado com WPM positivo.
- [x] "Marcar todas como lidas" remove o badge.
- [x] Preferência de perfil público é alterada e persistida.
- [x] Sidebar mobile começa off-canvas.
- [x] Menu mobile abre.
- [x] Recuperação de senha é pública.
- [x] Recuperação exibe confirmação.
- [x] Cadastro cria conta e entra no painel.
- [x] Rota inexistente mostra a página 404.

### 15.3 Revisão visual

- [x] Login em desktop.
- [x] Cadastro em desktop.
- [x] Painel em desktop.
- [x] Trilhas e detalhe da trilha.
- [x] Prática e resultado.
- [x] Progresso, desafios e conquistas.
- [x] Ranking, notificações e perfil.
- [x] Painel em mobile.
- [x] Menu mobile aberto.
- [x] Prática em mobile.
- [x] Página 404.

### 15.4 Correções aplicadas durante a revisão

| Problema encontrado | Correção |
| --- | --- |
| Imports de `pages/app` apontavam um nível acima do correto | Ajuste em lote para `../../components`, `../../context`, `../../hooks` e `../../lib` |
| `ProtectedRoute` era export default, mas importado como nomeado | Import ajustado em `App.jsx` para default + `PublicOnlyRoute` nomeado |
| Textos de nove páginas com dupla codificação (`diÃ¡ria`) | Arquivos corrigidos para UTF-8 e verificação global de resíduos |
| Desafios exibiam 100% com 5 de 6 metas concluídas | Cálculo geral passou de `Math.round` para `Math.floor` |
| FAQ da landing ainda dizia que cadastro e login chegariam depois | Pergunta e resposta atualizadas para a conta local da Etapa 02 |

---

## 16. Como executar e validar

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

### Conta de demonstração

```text
E-mail: marina@digitacourse.com
Senha:  qualquer valor com 4 ou mais caracteres
```

Também é possível clicar em **Entrar com conta de demonstração** na tela de login.

### Roteiro rápido de verificação

1. Abrir `/` e clicar em "Começar a praticar" ou "Entrar".
2. Entrar com a conta demo e conferir o painel.
3. Abrir "Trilhas", entrar em "Fundamentos do teclado" e iniciar uma lição.
4. Digitar o texto, conferir WPM/precisão ao vivo e concluir.
5. Voltar ao painel e conferir a atualização do progresso e da notificação.
6. Abrir progresso, desafios, conquistas, ranking, notificações e perfil.
7. Desativar o perfil público e conferir a saída do ranking.
8. Redimensionar para 390 px, abrir o menu, navegar e testar a prática.
9. Abrir uma URL inexistente e conferir a página 404.
10. Sair e confirmar o retorno à landing page.

### Limpar os dados locais

No console do navegador:

```js
localStorage.removeItem('digitacourse:accounts:v1')
localStorage.removeItem('digitacourse:session:v1')
```

Ao recarregar, a conta demo é recriada automaticamente.

---

## 17. Limitações e provisões

| Limitação atual | Provisão para as próximas etapas |
| --- | --- |
| Sem back-end | Criar API Spring Boot e banco PostgreSQL |
| Senhas não são armazenadas nem validadas de verdade | Implementar hash, políticas de senha e autenticação real |
| Sessão em `localStorage` | Migrar para cookie seguro/token emitido pelo servidor |
| Dados restritos ao navegador | Persistir conta, progresso e preferências no banco |
| Recuperação de senha simulada | Integrar envio de e-mail e token de redefinição |
| Notificações apenas no app | Implementar e-mail e, se necessário, push |
| Ranking fictício | Criar ranking real com regras, moderação e anti-fraude |
| Sem área administrativa | Planejar gestão de alunos, trilhas e relatórios em etapa própria |
| Sem upload de avatar ou edição de e-mail | Definir modelo de mídia e regras de identidade |
| Sem testes automatizados versionados | Adicionar testes de componentes e fluxos críticos |
| Sem lint/formatador | Configurar ESLint/Prettier |
| Sem auditoria de acessibilidade | Rodar axe/Lighthouse e testes com leitores de tela |
| SPA sem fallback de deploy | Configurar rewrite para `index.html` no host |
| Prática depende de teclado físico | Avaliar exercícios alternativos para toque |
| Percentual de desafios usa média simples | Reavaliar pesos e metas com dados reais |

---

## 18. Próximos passos

1. Validar a experiência com o orientador e ajustar conteúdo/identidade.
2. Definir o modelo de autenticação e o contrato da API.
3. Estruturar o backend Spring Boot e o PostgreSQL.
4. Implementar cadastro, login e sessão reais.
5. Migrar trilhas, lições, tentativas e preferências para o banco.
6. Conectar o motor de prática à API, mantendo o cálculo no cliente quando fizer sentido.
7. Implementar ranking real e notificações por e-mail.
8. Planejar a área administrativa em uma etapa separada.
9. Adicionar testes automatizados, lint e auditoria de acessibilidade.
10. Configurar deploy com fallback de SPA e metadados de produção.

---

## 19. Arquivos entregues

| Arquivo | Função |
| --- | --- |
| `frontend/src/App.jsx` | Rotas públicas, protegidas, prática isolada e 404 |
| `frontend/src/main.jsx` | Router, providers, fontes e CSS |
| `frontend/src/context/AppContext.jsx` | Conta, sessão, progresso, tentativas, preferências e notificações |
| `frontend/src/context/ToastContext.jsx` | Avisos temporários |
| `frontend/src/data/courses.js` | Três trilhas e doze lições |
| `frontend/src/data/seed.js` | Conta demo, conta vazia e dados iniciais |
| `frontend/src/data/community.js` | Perfis fictícios do ranking |
| `frontend/src/lib/metrics.js` | Estatísticas, progresso, desafios, conquistas, heatmap e ranking |
| `frontend/src/lib/format.js` | Formatação de datas, números, minutos e iniciais |
| `frontend/src/hooks/usePageMeta.js` | Título e descrição por rota |
| `frontend/src/hooks/useReveal.js` | Animações de entrada com observers |
| `frontend/src/components/app/*` | Shell, navegação, cartões, gráficos e estados |
| `frontend/src/components/auth/AuthLayout.jsx` | Layout das telas de autenticação |
| `frontend/src/pages/auth/*` | Login, cadastro e recuperação |
| `frontend/src/pages/app/*` | Painel, trilhas, progresso, desafios, conquistas, ranking, notificações e perfil |
| `frontend/src/pages/PracticePage.jsx` | Motor de prática e resultado |
| `frontend/src/pages/NotFoundPage.jsx` | Página 404 |
| `frontend/src/styles/app.css` | Estilos da aplicação e responsividade |
| `frontend/src/components/Navbar.jsx` | CTAs integrados ao login/cadastro |
| `frontend/src/components/Hero.jsx` | CTA para cadastro ou próxima lição |
| `frontend/src/components/FinalCta.jsx` | CTA para cadastro ou próxima lição |
| `frontend/src/components/Faq.jsx` | FAQ atualizado para a conta local |
| `README.md` | Status, rotas e instruções atualizadas |
| `docs/README.md` | Índice da documentação atualizado |
| `docs/assets/etapa-02/*` | Dezessete capturas da etapa |

---

## 20. Critérios de aceite da etapa

- [x] A landing page leva a fluxos reais de login e cadastro.
- [x] É possível criar uma conta local e entrar na área do aluno.
- [x] A conta demo entra com dados completos.
- [x] Rotas protegidas redirecionam visitantes para o login.
- [x] Rotas públicas redirecionam alunos autenticados para o painel.
- [x] O painel apresenta próxima lição, meta, estatísticas e atividade.
- [x] As três trilhas e as doze lições estão disponíveis.
- [x] Lições bloqueadas não podem ser praticadas.
- [x] A prática funciona no navegador e calcula WPM/precisão.
- [x] A conclusão registra tentativa, progresso, XP e notificação.
- [x] Progresso, desafios, conquistas e ranking refletem os dados da conta.
- [x] Notificações podem ser lidas individualmente ou em lote.
- [x] O perfil salva nome, meta e preferências localmente.
- [x] O perfil público pode ser desativado e remove o aluno do ranking.
- [x] A interface funciona em desktop e celular.
- [x] A página 404 existe e se adapta ao estado de autenticação.
- [x] O build de produção conclui sem erros.
- [x] A validação automatizada passou em 25 de 25 verificações, sem erros de console.
- [x] A documentação da etapa está registrada neste arquivo.
