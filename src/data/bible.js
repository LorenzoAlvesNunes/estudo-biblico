const oldTestamentNames = [
  "Genesis",
  "Exodo",
  "Levitico",
  "Numeros",
  "Deuteronomio",
  "Josue",
  "Juizes",
  "Rute",
  "1 Samuel",
  "2 Samuel",
  "1 Reis",
  "2 Reis",
  "1 Cronicas",
  "2 Cronicas",
  "Esdras",
  "Neemias",
  "Ester",
  "Jo",
  "Salmos",
  "Proverbios",
  "Eclesiastes",
  "Cantares",
  "Isaias",
  "Jeremias",
  "Lamentacoes",
  "Ezequiel",
  "Daniel",
  "Oseias",
  "Joel",
  "Amos",
  "Obadias",
  "Jonas",
  "Miqueias",
  "Naum",
  "Habacuque",
  "Sofonias",
  "Ageu",
  "Zacarias",
  "Malaquias"
];

const newTestamentNames = [
  "Mateus",
  "Marcos",
  "Lucas",
  "Joao",
  "Atos",
  "Romanos",
  "1 Corintios",
  "2 Corintios",
  "Galatas",
  "Efesios",
  "Filipenses",
  "Colossenses",
  "1 Tessalonicenses",
  "2 Tessalonicenses",
  "1 Timoteo",
  "2 Timoteo",
  "Tito",
  "Filemom",
  "Hebreus",
  "Tiago",
  "1 Pedro",
  "2 Pedro",
  "1 Joao",
  "2 Joao",
  "3 Joao",
  "Judas",
  "Apocalipse"
];

const categories = {
  Genesis: "Pentateuco",
  Exodo: "Pentateuco",
  Levitico: "Pentateuco",
  Numeros: "Pentateuco",
  Deuteronomio: "Pentateuco",
  Josue: "Historicos",
  Juizes: "Historicos",
  Rute: "Historicos",
  "1 Samuel": "Historicos",
  "2 Samuel": "Historicos",
  "1 Reis": "Historicos",
  "2 Reis": "Historicos",
  "1 Cronicas": "Historicos",
  "2 Cronicas": "Historicos",
  Esdras: "Historicos",
  Neemias: "Historicos",
  Ester: "Historicos",
  Jo: "Poeticos",
  Salmos: "Poeticos",
  Proverbios: "Poeticos",
  Eclesiastes: "Poeticos",
  Cantares: "Poeticos",
  Isaias: "Profetas Maiores",
  Jeremias: "Profetas Maiores",
  Lamentacoes: "Profetas Maiores",
  Ezequiel: "Profetas Maiores",
  Daniel: "Profetas Maiores",
  Oseias: "Profetas Menores",
  Joel: "Profetas Menores",
  Amos: "Profetas Menores",
  Obadias: "Profetas Menores",
  Jonas: "Profetas Menores",
  Miqueias: "Profetas Menores",
  Naum: "Profetas Menores",
  Habacuque: "Profetas Menores",
  Sofonias: "Profetas Menores",
  Ageu: "Profetas Menores",
  Zacarias: "Profetas Menores",
  Malaquias: "Profetas Menores",
  Mateus: "Evangelhos",
  Marcos: "Evangelhos",
  Lucas: "Evangelhos",
  Joao: "Evangelhos",
  Atos: "Historia da Igreja",
  Romanos: "Cartas Paulinas",
  "1 Corintios": "Cartas Paulinas",
  "2 Corintios": "Cartas Paulinas",
  Galatas: "Cartas Paulinas",
  Efesios: "Cartas Paulinas",
  Filipenses: "Cartas Paulinas",
  Colossenses: "Cartas Paulinas",
  "1 Tessalonicenses": "Cartas Paulinas",
  "2 Tessalonicenses": "Cartas Paulinas",
  "1 Timoteo": "Cartas Pastorais",
  "2 Timoteo": "Cartas Pastorais",
  Tito: "Cartas Pastorais",
  Filemom: "Cartas Paulinas",
  Hebreus: "Cartas Gerais",
  Tiago: "Cartas Gerais",
  "1 Pedro": "Cartas Gerais",
  "2 Pedro": "Cartas Gerais",
  "1 Joao": "Cartas Gerais",
  "2 Joao": "Cartas Gerais",
  "3 Joao": "Cartas Gerais",
  Judas: "Cartas Gerais",
  Apocalipse: "Profecia"
};

const details = {
  Genesis: {
    author: "Moises, segundo a tradicao judaico-crista.",
    date: "Eventos primordiais e patriarcais; composicao tradicionalmente associada ao periodo mosaico.",
    theme: "Criacao, queda, alianca, promessa e formacao do povo de Deus.",
    purpose: "Mostrar Deus como Criador soberano e iniciar a historia redentiva que culmina em Cristo.",
    timeline: ["Criacao", "Queda", "Diluvio", "Babel", "Abraao", "Isaque", "Jaco", "Jose no Egito"],
    characters: ["Adao", "Eva", "Noe", "Abraao", "Sara", "Jaco", "Jose"],
    keyVerses: ["Gn 1:1", "Gn 12:3", "Gn 50:20"],
    chapters: [
      "Caps. 1-11: origem do mundo, pecado, juizo e preservacao.",
      "Caps. 12-36: promessa, alianca e familia patriarcal.",
      "Caps. 37-50: Jose, providencia e preservacao no Egito."
    ],
    jesus: "A semente da mulher, a promessa a Abraao e a providencia redentiva apontam para Cristo.",
    originalWords: ["bereshit: no principio", "tselem: imagem", "berit: alianca"]
  },
  Exodo: {
    author: "Moises, segundo a tradicao judaico-crista.",
    date: "Periodo do exodo e da peregrinacao no deserto.",
    theme: "Libertacao, alianca, presenca de Deus e adoracao.",
    purpose: "Revelar o Deus que salva, forma uma nacao santa e habita no meio do seu povo.",
    timeline: ["Opressao no Egito", "Chamado de Moises", "Pragas", "Pascoa", "Mar Vermelho", "Sinai", "Tabernaculo"],
    characters: ["Moises", "Aarao", "Farao", "Miriã", "Josue"],
    keyVerses: ["Ex 3:14", "Ex 12:13", "Ex 19:5-6"],
    chapters: [
      "Caps. 1-6: opressao, chamado e revelacao do Nome.",
      "Caps. 7-15: juizo sobre o Egito e redencao pela Pascoa.",
      "Caps. 16-40: alianca, lei, queda do bezerro e tabernaculo."
    ],
    jesus: "Cristo e nosso Cordeiro pascal, Mediador superior e presenca de Deus entre nos.",
    originalWords: ["YHWH: Eu Sou", "pesach: passagem/Pascoa", "mishkan: tabernaculo"]
  },
  Joao: {
    author: "Joao, o discipulo amado, conforme a tradicao primitiva.",
    date: "Provavelmente final do seculo I.",
    theme: "Jesus como Verbo eterno, Filho de Deus e fonte da vida.",
    purpose: "Levar o leitor a crer que Jesus e o Cristo e, crendo, ter vida em seu nome.",
    timeline: ["Prologo", "Sinais", "Discursos", "Ceia", "Paixao", "Ressurreicao", "Envio"],
    characters: ["Jesus", "Maria", "Nicodemos", "Samaritana", "Lazaro", "Tome", "Pedro"],
    keyVerses: ["Jo 1:14", "Jo 3:16", "Jo 20:31"],
    chapters: [
      "Caps. 1-12: sinais publicos e encontros transformadores.",
      "Caps. 13-17: amor, servico, Espirito e unidade.",
      "Caps. 18-21: cruz, ressurreicao e restauracao."
    ],
    jesus: "Joao apresenta Jesus como o Verbo eterno feito carne, revelacao plena do Pai.",
    originalWords: ["logos: Palavra/Verbo", "zoe: vida", "pisteuo: crer/confiar"]
  },
  Romanos: {
    author: "Paulo, escrevendo aos cristaos em Roma.",
    date: "Por volta de 57 d.C., provavelmente a partir de Corinto.",
    theme: "Justica de Deus, pecado, graca, fe, Israel, Espirito e vida transformada.",
    purpose: "Expor o evangelho de forma robusta e preparar uma igreja unida para a missao.",
    timeline: ["Culpa universal", "Justificacao", "Nova vida", "Israel", "Etica do Reino", "Missao"],
    characters: ["Paulo", "Febe", "Abraao", "Adao", "Cristo", "Igreja em Roma"],
    keyVerses: ["Rm 1:16-17", "Rm 5:1", "Rm 8:1"],
    chapters: [
      "Caps. 1-4: pecado universal e justificacao pela fe.",
      "Caps. 5-8: paz, uniao com Cristo e vida no Espirito.",
      "Caps. 9-16: Israel, comunidade, missao e saudacoes."
    ],
    jesus: "Cristo e o novo Adao, nossa justica, reconciliacao e Senhor da nova humanidade.",
    originalWords: ["dikaiosyne: justica", "pistis: fe", "charis: graca"]
  },
  Apocalipse: {
    author: "Joao, servo de Jesus Cristo.",
    date: "Fim do seculo I, em contexto de pressao imperial.",
    theme: "Cristo reina, julga o mal, sustenta a igreja e consuma a nova criacao.",
    purpose: "Consolar, corrigir e fortalecer a igreja para fidelidade ate o fim.",
    timeline: ["Cristo glorificado", "Sete igrejas", "Trono", "Selos", "Trombetas", "Tacas", "Nova Jerusalem"],
    characters: ["Cristo", "Joao", "Sete igrejas", "Cordeiro", "Besta", "Nova Jerusalem"],
    keyVerses: ["Ap 1:8", "Ap 5:9", "Ap 21:5"],
    chapters: [
      "Caps. 1-3: Cristo e as igrejas.",
      "Caps. 4-20: adoracao celestial, juizos e vitoria do Cordeiro.",
      "Caps. 21-22: nova criacao e consumacao."
    ],
    jesus: "Jesus aparece como Cordeiro vencedor, Rei dos reis e Alfa e Omega.",
    originalWords: ["apokalypsis: revelacao", "arnion: cordeiro", "nikao: vencer"]
  }
};

const oldTestamentAuthors = {
  Pentateuco: "Moises, segundo a tradicao judaico-crista.",
  Historicos: "Autores profeticos e compiladores inspirados ligados a historia de Israel.",
  Poeticos: "Diversos autores de sabedoria, louvor e poesia inspirada.",
  "Profetas Maiores": "Profeta nomeado no proprio livro ou tradicao profetica associada.",
  "Profetas Menores": "Profeta nomeado no proprio livro."
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function makeBook(name, index, testament) {
  const category = categories[name];
  const isOld = testament === "Antigo Testamento";
  const fallbackAuthor = isOld ? oldTestamentAuthors[category] : category === "Evangelhos" ? `Tradicionalmente atribuido ao evangelista ${name}.` : "Autor apostolico ou associado ao circulo apostolico, conforme o testemunho historico da igreja.";
  const base = {
    id: slugify(name),
    name,
    testament,
    category,
    progress: [72, 48, 34, 22, 18, 11, 7][index % 7],
    author: fallbackAuthor,
    date: isOld ? "Periodo do Antigo Testamento; data estudada conforme contexto historico do livro." : "Seculo I d.C., no periodo apostolico.",
    theme: isOld
      ? "Aliança, santidade, pecado, juizo, promessa e esperanca messianica."
      : "Cristo, evangelho, igreja, discipulado, graca, verdade e esperanca final.",
    purpose: isOld
      ? "Ensinar quem Deus e, como Ele conduz seu povo e como prepara a vinda do Messias."
      : "Formar discipulos maduros, centrados em Cristo e fieis ao evangelho.",
    curiosities: [
      "O livro deve ser lido dentro do seu genero literario e do contexto da alianca.",
      "A interpretacao fiel considera autor, publico original, estrutura e lugar na historia da redencao."
    ],
    spiritualImportance: "Ajuda o estudante a conhecer o carater de Deus, discernir o pecado e responder com fe obediente.",
    historicalContext: [
      isOld ? "Cultura do antigo Oriente Proximo, com tribos, reinos, templos e alianças." : "Cultura judaica e greco-romana do primeiro seculo.",
      isOld ? "Politica marcada por familias patriarcais, monarquia, exilio ou restauracao." : "Politica sob dominio romano, sinagogas, cidades e tensoes religiosas.",
      isOld ? "Religioes vizinhas envolviam idolatria, cultos de fertilidade e poderes imperiais." : "O ambiente inclui judaismo do Segundo Templo, filosofia greco-romana e culto imperial.",
      isOld ? "Geografia ligada a Canaã, Egito, Mesopotamia, deserto e rotas antigas." : "Geografia ligada a Judeia, Galileia, Asia Menor, Grecia, Roma e Mediterraneo."
    ],
    timeline: isOld
      ? ["Contexto da alianca", "Conflito espiritual", "Resposta humana", "Juizo ou restauracao", "Esperanca messianica"]
      : ["Ministerio apostolico", "Ensino central", "Formacao da igreja", "Desafios pastorais", "Esperanca em Cristo"],
    characters: isOld ? ["Deus", "Israel", "Lideres do povo", "Profetas", "Nacoes vizinhas"] : ["Jesus", "Apostolos", "Igreja", "Lideres locais", "Opositores"],
    keyVerses: ["Estudo guiado", "Texto-chave", "Aplicacao"],
    chapters: [
      "Abertura: apresenta o contexto, o problema principal e a direcao do livro.",
      "Desenvolvimento: aprofunda conflito, ensino, promessa, advertencia ou formacao do povo.",
      "Conclusao: conduz o leitor a resposta de fe, obediencia, esperanca e adoracao."
    ],
    theology: "Este livro deve ser estudado observando Deus, pecado, alianca, graca, santidade, promessa, salvacao e missao dentro da historia biblica.",
    jesus: isOld
      ? "Aponta para Cristo por promessa, tipologia, alianca, sacerdocio, reino, sabedoria ou esperanca messianica."
      : "Revela a pessoa, obra, senhorio, ensino e retorno de Cristo de forma direta ou pastoral.",
    originalWords: isOld ? ["berit: alianca", "hesed: amor leal", "qadosh: santo"] : ["charis: graca", "pistis: fe", "ekklesia: igreja"],
    archaeology: isOld
      ? "Descobertas do antigo Oriente Proximo ajudam a entender costumes, tratados, cidades, guerras e praticas religiosas."
      : "Inscricoes, moedas, sinagogas, estradas romanas e cidades antigas ajudam a iluminar o Novo Testamento.",
    interpretationErrors: [
      "Ler versiculos isolados sem contexto literario e historico.",
      "Transformar narrativas descritivas em mandamentos universais sem criterio.",
      "Ignorar como o livro se conecta com Cristo e com a historia da redencao."
    ],
    practice: "Leia com oracao, observe o contexto, identifique o ensino central, aplique com humildade e compartilhe com fidelidade.",
    devotional: {
      reflection: "Deus nao entrega apenas informacao; Ele forma o coracao pela verdade revelada.",
      teaching: "O estudo profundo deve produzir obediencia, adoracao, discernimento e amor pratico.",
      prayer: "Senhor, abre meu entendimento, purifica minhas motivacoes e guia minha vida pela tua Palavra. Amem."
    },
    quiz: [
      "Facil: qual e o tema central deste livro?",
      "Media: como o contexto historico muda a leitura do texto?",
      "Dificil: como este livro se conecta com Cristo e com a historia da redencao?"
    ]
  };

  return { ...base, ...(details[name] ?? {}) };
}

export const books = [
  ...oldTestamentNames.map((name, index) => makeBook(name, index, "Antigo Testamento")),
  ...newTestamentNames.map((name, index) => makeBook(name, index, "Novo Testamento"))
];

export const studyCollections = [
  { label: "Antigo Testamento", count: oldTestamentNames.length },
  { label: "Novo Testamento", count: newTestamentNames.length },
  { label: "Total", count: oldTestamentNames.length + newTestamentNames.length }
];

export const metrics = [
  { label: "Progresso biblico", value: "41%", detail: "486 capitulos estudados" },
  { label: "Sequencia", value: "18 dias", detail: "melhor marca: 31 dias" },
  { label: "Streak diario", value: "7/7", detail: "semana perfeita" },
  { label: "Ranking espiritual", value: "Ouro II", detail: "top 8% da comunidade" },
  { label: "Tempo estudado", value: "62h", detail: "media de 28min por sessao" },
  { label: "Favoritos", value: "128", detail: "versiculos e notas salvos" }
];

export const quizQuestions = [
  {
    question: "Qual tema domina Genesis 12?",
    options: ["A chamada e promessa a Abraao", "A reconstrucao do templo", "A queda de Jerico", "O sermao do monte"],
    answer: 0,
    level: "Fundamentos"
  },
  {
    question: "Em Joao, os sinais apontam principalmente para:",
    options: ["Poder politico", "Identidade messianica de Jesus", "Rituais do templo", "Genealogias reais"],
    answer: 1,
    level: "Intermediario"
  },
  {
    question: "Romanos 8 enfatiza:",
    options: ["A construcao da arca", "A vida no Espirito e seguranca em Cristo", "A divisao do reino", "As pragas do Egito"],
    answer: 1,
    level: "Avancado"
  }
];

export const devotion = {
  date: "Hoje",
  passage: "Salmo 119:105",
  reading: "Lampada para os meus pes e luz para o meu caminho.",
  prayer: "Senhor, guia minhas decisoes com tua Palavra e forma em mim uma atencao obediente.",
  reflection:
    "A Palavra nao promete mostrar toda a estrada de uma vez. Ela ilumina o proximo passo com fidelidade suficiente para caminhar."
};
