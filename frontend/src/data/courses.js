export const courses = [
  {
    id: 'fundamentos',
    title: 'Fundamentos do teclado',
    shortTitle: 'Fundamentos',
    description:
      'Encontre a posição das mãos, domine as teclas guias e construa uma base confortável para digitar sem olhar.',
    level: 'Iniciante',
    tone: 'mint',
    duration: 18,
    focus: 'Postura e home row',
    modules: [
      {
        id: 'fundamentos-1',
        title: 'Primeiros passos',
        lessons: [
          {
            id: 'fund-01',
            title: 'Encontre a posição das mãos',
            description:
              'Aprenda a apoiar os dedos na home row e a voltar sempre para as teclas guias.',
            duration: 4,
            xp: 40,
            focus: 'Home row',
            text: 'asdf jkl; asdf jkl; f j f j d k d k s l s l a ; a ;',
          },
          {
            id: 'fund-02',
            title: 'Teclas guias F e J',
            description:
              'Use os relevos das teclas F e J para se orientar sem tirar os olhos da tela.',
            duration: 4,
            xp: 45,
            focus: 'F e J',
            text: 'f j f j ff jj fj jf fjj jff fjfj jfjf asdf jkl; asdf jkl;',
          },
        ],
      },
      {
        id: 'fundamentos-2',
        title: 'Ganhe ritmo',
        lessons: [
          {
            id: 'fund-03',
            title: 'Home row sem olhar',
            description:
              'Una as teclas da home row em palavras curtas e mantenha um ritmo constante.',
            duration: 5,
            xp: 55,
            focus: 'Ritmo',
            text: 'as flores do jardim florescem com a luz do sol e o cuidado de cada dia',
          },
          {
            id: 'fund-04',
            title: 'Palavras curtas',
            description: 'Pratique a transição entre a home row e as teclas vizinhas.',
            duration: 5,
            xp: 55,
            focus: 'Precisão',
            text: 'a casa da amiga fica perto da praia e do mercado central da cidade',
          },
        ],
      },
    ],
  },
  {
    id: 'dia-a-dia',
    title: 'Palavras do dia a dia',
    shortTitle: 'Dia a dia',
    description:
      'Leve o treino para a vida real com palavras, acentos, números, mensagens e horários que aparecem na sua rotina.',
    level: 'Intermediário',
    tone: 'amber',
    duration: 23,
    focus: 'Vocabulário e acentuação',
    modules: [
      {
        id: 'dia-a-dia-1',
        title: 'Vocabulário essencial',
        lessons: [
          {
            id: 'dia-01',
            title: 'Palavras da rotina',
            description: 'Palavras comuns do cotidiano, sem pressa e com atenção à precisão.',
            duration: 5,
            xp: 60,
            focus: 'Rotina',
            text: 'hoje eu acordo cedo preparo o cafe organizo a mesa e sigo para o trabalho',
          },
          {
            id: 'dia-02',
            title: 'Acentuação',
            description:
              'Treine palavras acentuadas e mantenha a fluência mesmo quando a tecla exige um passo extra.',
            duration: 6,
            xp: 65,
            focus: 'Acentuação',
            text: 'a prática constante é a chave para a fluência e para a confiança no teclado',
          },
        ],
      },
      {
        id: 'dia-a-dia-2',
        title: 'Textos do cotidiano',
        lessons: [
          {
            id: 'dia-03',
            title: 'Mensagens e e-mails',
            description: 'Uma mensagem profissional curta, com pontuação e acentuação.',
            duration: 6,
            xp: 70,
            focus: 'Mensagens',
            text: 'olá, tudo bem? preciso confirmar a reunião de amanhã às nove horas no escritório central',
          },
          {
            id: 'dia-04',
            title: 'Números e horários',
            description: 'Pratique números, símbolos de hora e pausas de pontuação.',
            duration: 6,
            xp: 70,
            focus: 'Números',
            text: 'a aula começa às 19h30 e termina às 21h, com uma pausa de 15 minutos para o café',
          },
        ],
      },
    ],
  },
  {
    id: 'fluencia',
    title: 'Textos com fluência',
    shortTitle: 'Fluência',
    description:
      'Avance para frases completas e parágrafos curtos. O foco deixa de ser a tecla e passa a ser a ideia.',
    level: 'Avançado',
    tone: 'teal',
    duration: 30,
    focus: 'Textos longos e ritmo',
    modules: [
      {
        id: 'fluencia-1',
        title: 'Frases completas',
        lessons: [
          {
            id: 'flu-01',
            title: 'Frases com pontuação',
            description: 'Maiúsculas, vírgulas e dois-pontos sem interromper o fluxo.',
            duration: 7,
            xp: 80,
            focus: 'Pontuação',
            text: 'Aprender a digitar é como aprender um instrumento: exige paciência, prática e atenção aos detalhes.',
          },
          {
            id: 'flu-02',
            title: 'Parágrafos curtos',
            description: 'Mantenha o ritmo em um parágrafo com duas frases e pontuação variada.',
            duration: 7,
            xp: 85,
            focus: 'Ritmo',
            text: 'A constância vence a intensidade. Quinze minutos por dia, bem aproveitados, valem mais do que horas de prática ocasional.',
          },
        ],
      },
      {
        id: 'fluencia-2',
        title: 'Desafio final',
        lessons: [
          {
            id: 'flu-03',
            title: 'Texto corrido',
            description: 'Um texto mais longo para consolidar ritmo, precisão e confiança.',
            duration: 8,
            xp: 90,
            focus: 'Fluência',
            text: 'A velocidade chega quando os dedos encontram o ritmo. Antes disso, cada pausa para pensar é parte do aprendizado e merece respeito.',
          },
          {
            id: 'flu-04',
            title: 'Desafio de fluência',
            description: 'A lição final combina tudo o que você treinou até aqui.',
            duration: 8,
            xp: 100,
            focus: 'Desafio final',
            text: 'Digitar com fluência não é correr sem olhar. É confiar no treino, manter a precisão e deixar que as ideias encontrem o caminho até a tela.',
          },
        ],
      },
    ],
  },
]

export const allLessons = courses.flatMap((course) =>
  course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      courseId: course.id,
      courseTitle: course.title,
      moduleTitle: module.title,
    })),
  ),
)

export function getCourse(courseId) {
  return courses.find((course) => course.id === courseId) ?? null
}

export function getLesson(lessonId) {
  return allLessons.find((lesson) => lesson.id === lessonId) ?? null
}
