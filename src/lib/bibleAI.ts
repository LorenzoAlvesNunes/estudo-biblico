/**
 * Bible AI - Integração com Bíblia Explicada Completa
 * Usa Claude para responder perguntas sobre a Bíblia com contexto real
 */

interface Versiculo {
  id: number;
  livro: string;
  capitulo: number;
  versiculo: number;
  referencia: string;
  palavra_chave: string;
  arquivo: string;
}

let versiculosCache: Versiculo[] | null = null;

/**
 * Carrega índice de versículos do arquivo JSON
 */
export async function carregarVersiculos(): Promise<Versiculo[]> {
  if (versiculosCache) return versiculosCache;

  try {
    const response = await fetch('/versiculos.json');
    versiculosCache = await response.json();
    return versiculosCache || [];
  } catch (error) {
    console.error('Erro ao carregar versículos:', error);
    return [];
  }
}

/**
 * Busca versículos relevantes para uma pergunta/palavra-chave
 */
export function buscarVersiculosRelevantes(
  query: string,
  versiculos: Versiculo[],
  limite: number = 10
): Versiculo[] {
  const queryLower = query.toLowerCase();

  // Busca por palavra-chave ou livro
  return versiculos
    .filter(v =>
      v.palavra_chave?.toLowerCase().includes(queryLower) ||
      v.livro?.toLowerCase().includes(queryLower) ||
      v.referencia?.toLowerCase().includes(queryLower)
    )
    .slice(0, limite);
}

/**
 * Formata versículos para enviar ao Claude
 */
function formatarContextoBiblico(versiculos: Versiculo[]): string {
  if (versiculos.length === 0) return '';

  return `
Versículos relevantes encontrados:
${versiculos.map(v => `- ${v.referencia} (Palavra-chave: ${v.palavra_chave})`).join('\n')}

Este é um banco de dados da "Bíblia Explicada Completa" com análises teológicas de todos os 31.102 versículos.
`.trim();
}

/**
 * Valida se pergunta é sobre Bíblia
 * Rejeita perguntas sobre assuntos mundanos
 */
export function validarPerguntaBiblica(pergunta: string): { valida: boolean; motivo?: string } {
  const perguntaLower = pergunta.toLowerCase().trim();

  // Palavras-chave bíblicas (PERMITE)
  const palavrasBiblicas = [
    'deus', 'jesus', 'cristo', 'biblia', 'verso', 'versiculo', 'capitulo', 'livro',
    'testamento', 'genesis', 'joao', 'mateus', 'marcos', 'lucas', 'romanos',
    'corintios', 'gálatas', 'efesios', 'filipenses', 'colossenses', 'tessalonissenses',
    'timoteo', 'tito', 'filemom', 'hebreus', 'tiago', 'pedro', 'joao', 'judas',
    'apocalipse', 'salmos', 'proverbios', 'eclesiastes', 'cantares', 'isaias',
    'jeremias', 'lamentacoes', 'ezequiel', 'daniel', 'oseias', 'joel', 'amos',
    'obadias', 'jonas', 'miqueias', 'naum', 'habacuque', 'sofonias', 'ageu',
    'zacarias', 'malaquias', 'fé', 'graça', 'aliança', 'salvação', 'amor',
    'perdão', 'redenção', 'ressurreição', 'espírito', 'santo', 'reino',
    'discipulado', 'evangelho', 'milagre', 'profecia', 'oração', 'intercessão',
    'santidade', 'obediência', 'arrependimento', 'batismo', 'eucaristia',
    'cristã', 'cristão', 'teologia', 'doutrina', 'espiritual', 'personagem',
    'apóstolo', 'profeta', 'sacerdote', 'rei', 'bênção', 'maldição',
    'guerra espiritual', 'demônio', 'anjo', 'igreja', 'corpo de cristo',
    // Personagens bíblicos comuns
    'davi', 'salomao', 'salomão', 'moises', 'moisés', 'abraao', 'abraão',
    'isaque', 'jaco', 'jacó', 'jose', 'josé', 'noe', 'noé', 'adao', 'adão',
    'eva', 'caim', 'abel', 'samuel', 'saul', 'elias', 'eliseu', 'jonas',
    'paulo', 'pedro', 'maria', 'jose', 'herodes', 'pilatos', 'judas',
    'lucas', 'mateus', 'marcos', 'estevao', 'estêvão', 'barnabe', 'barnabé',
    'timoteo', 'lazaro', 'lázaro', 'marta', 'madalena', 'gideao', 'gideão',
    'sansao', 'sansão', 'rute', 'ester', 'jó', 'daniel', 'ezequiel',
    'faraó', 'farao', 'goliais', 'golias', 'bate-seba', 'absalao', 'absalão',
    // Termos e perguntas comuns
    'quem era', 'quem foi', 'quem e', 'quem é', 'o que e', 'o que é',
    'parabola', 'parábola', 'mandamento', 'pecado', 'céu', 'ceu', 'inferno',
    'paraiso', 'paraíso', 'criacao', 'criação', 'diluvio', 'dilúvio',
    'exodo', 'êxodo', 'cruz', 'calvario', 'calvário', 'pentecostes',
    'trindade', 'pai', 'filho', 'palavra', 'escritura', 'sagrada'
  ];

  // Assuntos PROIBIDOS (REJEITA)
  const assuntosProibidos = [
    'carro', 'coche', 'automovel', 'futebol', 'bola', 'jogo', 'time',
    'receita', 'comida', 'comedo', 'prato', 'bolo', 'pizza', 'hamburger',
    'filme', 'série', 'netflix', 'youtube', 'música', 'canção', 'banda',
    'programação', 'código', 'software', 'computador', 'celular', 'whatsapp',
    'política', 'eleição', 'voto', 'candidato', 'governo', 'presidente',
    'amor mundano', 'namoro', 'sexo', 'relacionamento', 'casamento secular',
    'esporte', 'olimpiadas', 'campeonato', 'placar', 'gol',
    'viagem', 'turismo', 'hotel', 'praia', 'montanha',
    'trabalho secular', 'emprego', 'salário', 'patrão',
    'horóscopo', 'astrologia', 'tarô', 'magia', 'bruxaria',
    'tecnologia', 'inteligência artificial', 'robô', 'máquina',
    'ciência mundana', 'física', 'química', 'biologia'
  ];

  // Se contém qualquer palavra-chave claramente bíblica, aceita direto.
  const temPalavraChave = palavrasBiblicas.some(palavra => perguntaLower.includes(palavra));
  if (temPalavraChave) {
    return { valida: true };
  }

  // Caso contrário, rejeita apenas se for claramente sobre um assunto mundano.
  for (const proibido of assuntosProibidos) {
    // Usa limites de palavra para evitar falsos positivos (ex.: "amos" dentro de "amos a Deus").
    const regex = new RegExp(`\\b${proibido.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(perguntaLower)) {
      return {
        valida: false,
        motivo: `❌ Desculpe! Essa pergunta parece ser sobre "${proibido.toUpperCase()}", não sobre Bíblia. Sou uma IA focada em teologia cristã e na Palavra de Deus.`
      };
    }
  }

  // Sem palavra proibida: deixa passar. A IA e o prompt cuidam de recusar o que não for bíblico.
  return { valida: true };
}

// Chave do Groq exposta no cliente (Groq é gratuito - sem risco de custo).
// Funciona em hospedagem estatica (GitHub Pages) sem precisar de backend.
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Detecta se a mensagem é apenas uma saudação/cumprimento.
 */
function ehSaudacao(texto: string): boolean {
  const t = texto.toLowerCase().trim().replace(/[!?.,]/g, '');
  const saudacoes = [
    'oi', 'ola', 'olá', 'opa', 'oie', 'eai', 'e ai', 'e aí', 'salve',
    'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', 'hey',
    'paz', 'paz do senhor', 'graça e paz', 'a paz', 'a paz do senhor',
    'tudo bem', 'tudo bom', 'blz', 'beleza', 'como vai', 'como voce esta',
    'como você está', 'oi tudo bem', 'ola tudo bem', 'bom dia tudo bem',
    'quem e voce', 'quem é você', 'quem voce e', 'o que voce faz',
    'o que você faz', 'como funciona', 'me ajuda', 'me ajude', 'comecar',
    'começar', 'start', 'inicio', 'início'
  ];
  return saudacoes.includes(t);
}

/**
 * Resposta de apresentação para saudações.
 */
const RESPOSTA_APRESENTACAO = `👋 Olá! Que alegria ter você aqui!

Sou a **IA Bíblica do Lumen Scriptura**, criada para te ajudar a estudar a Palavra de Deus com profundidade. Tenho acesso a análises de todos os **31.102 versículos** da Bíblia.

Posso te ajudar com:

📖 **Versículos** — significado e contexto de qualquer passagem
📚 **Temas teológicos** — fé, graça, salvação, amor, aliança...
✝️ **Personagens bíblicos** — Davi, Paulo, Jesus, Moisés...
🙏 **Aplicação prática** — como viver a fé no dia a dia
⛪ **Doutrina e espiritualidade** cristã

O que você gostaria de explorar hoje na Palavra? 🕊️`;

/** Mensagem do histórico de conversa enviada ao modelo. */
export interface MensagemHistorico {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Pergunta à IA Bíblica
 * Chama o Groq direto do navegador (client-side) com contexto da Bíblia Explicada Completa.
 * Não precisa de backend - funciona em hospedagem estática.
 * O parâmetro `historico` dá memória de conversa (lembra das mensagens anteriores).
 */
export async function perguntarIABiblica(
  pergunta: string,
  historico: MensagemHistorico[] = []
): Promise<string> {
  // Saudações recebem uma apresentação calorosa (sem chamar a API)
  if (ehSaudacao(pergunta)) {
    return RESPOSTA_APRESENTACAO;
  }

  // Valida se pergunta é sobre Bíblia
  const validacao = validarPerguntaBiblica(pergunta);
  if (!validacao.valida) {
    return validacao.motivo || '❌ Pergunta fora do escopo bíblico.';
  }

  if (!GROQ_API_KEY) {
    return '⚠️ A IA Bíblica ainda não está configurada (chave de API ausente). Avise o administrador.';
  }

  try {
    // Carrega versículos e busca os mais relevantes
    const versiculos = await carregarVersiculos();
    const relevantes = buscarVersiculosRelevantes(pergunta, versiculos, 5);
    const contexto = formatarContextoBiblico(relevantes);

    // Monta a mensagem do usuário com o contexto bíblico encontrado
    const userMessage = `${contexto ? `Contexto bíblico:\n${contexto}\n\n` : ''}Pergunta do usuário: ${pergunta}\n\nPor favor, responda de forma pastoral, teológica e prática, citando versículos específicos quando apropriado.`;

    // Chama o Groq diretamente do navegador
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
          // Histórico recente da conversa (até 8 últimas mensagens) para dar memória
          ...historico.slice(-8),
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const detalhe = await response.text();
      console.error('Erro da Groq API:', detalhe);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    let resposta: string = data.choices?.[0]?.message?.content || 'Não foi possível gerar resposta.';

    // Acrescenta os versículos relacionados no final
    if (relevantes.length > 0) {
      resposta += `\n\n### Versículos Relacionados:\n`;
      relevantes.forEach((v) => {
        resposta += `- **${v.referencia}** (${v.palavra_chave})\n`;
      });
    }

    return resposta;
  } catch (error) {
    console.error('Erro na IA Bíblica:', error);
    throw error;
  }
}

/**
 * Helper de baixo nível: chama o Groq e retorna o texto da resposta.
 * Aceita opção de forçar resposta em JSON.
 */
async function chamarGroq(
  messages: { role: string; content: string }[],
  opcoes: { json?: boolean; maxTokens?: number } = {}
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('CHAVE_AUSENTE');
  }

  const body: Record<string, unknown> = {
    model: GROQ_MODEL,
    max_tokens: opcoes.maxTokens ?? 1024,
    messages
  };
  if (opcoes.json) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const detalhe = await response.text();
    console.error('Erro da Groq API:', detalhe);
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/** Resposta de estudo estruturada em blocos didáticos. */
export interface EstudoEstruturado {
  title: string;
  summary: string;
  context: string;
  meaning: string;
  application: string;
  connections: string;
  verses: string[];
}

/**
 * Gera um estudo bíblico estruturado (contexto, significado, aplicação, conexões)
 * usando a IA real. Retorna JSON pronto para exibir em blocos.
 */
export async function perguntarEstudoEstruturado(pergunta: string): Promise<EstudoEstruturado> {
  const validacao = validarPerguntaBiblica(pergunta);
  if (!validacao.valida) {
    return {
      title: 'Pergunta fora do escopo',
      summary: validacao.motivo || 'Tente perguntar sobre um tema bíblico.',
      context: '', meaning: '', application: '', connections: '', verses: []
    };
  }

  const versiculos = await carregarVersiculos();
  const relevantes = buscarVersiculosRelevantes(pergunta, versiculos, 5);
  const contexto = formatarContextoBiblico(relevantes);

  const prompt = `${contexto ? `${contexto}\n\n` : ''}Pergunta de estudo: "${pergunta}"

Responda APENAS com um objeto JSON válido, em português, com esta estrutura exata:
{
  "title": "título curto e claro do estudo",
  "summary": "resumo pastoral de 2-3 frases sobre o tema",
  "context": "contexto histórico e cultural (mundo antigo, situação original)",
  "meaning": "significado teológico e espiritual da passagem/tema",
  "application": "aplicação prática para a vida cristã hoje",
  "connections": "conexões com outras passagens e com Jesus Cristo",
  "verses": ["Referência 1", "Referência 2", "Referência 3"]
}

Seja profundo, fiel à Bíblia e didático. Não escreva nada fora do JSON.`;

  const conteudo = await chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      { role: 'user', content: prompt }
    ],
    { json: true, maxTokens: 1500 }
  );

  try {
    const parsed = JSON.parse(conteudo) as Partial<EstudoEstruturado>;
    return {
      title: parsed.title || pergunta,
      summary: parsed.summary || '',
      context: parsed.context || '',
      meaning: parsed.meaning || '',
      application: parsed.application || '',
      connections: parsed.connections || '',
      verses: Array.isArray(parsed.verses) ? parsed.verses : relevantes.map((v) => v.referencia)
    };
  } catch {
    // Se o JSON vier malformado, devolve o texto bruto no resumo
    return {
      title: pergunta,
      summary: conteudo || 'Não foi possível gerar o estudo.',
      context: '', meaning: '', application: '', connections: '',
      verses: relevantes.map((v) => v.referencia)
    };
  }
}

/**
 * Reescreve um texto bíblico de forma bem simples ("como se tivesse 12 anos").
 */
export async function explicarSimples(textoOriginal: string): Promise<string> {
  return chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      {
        role: 'user',
        content: `Reescreva a explicação abaixo de forma MUITO simples e curta, como se estivesse explicando para uma criança de 12 anos, usando linguagem fácil e exemplos do dia a dia, mas mantendo a fidelidade bíblica:\n\n"${textoOriginal}"`
      }
    ],
    { maxTokens: 600 }
  );
}

/** Uma pergunta de quiz com alternativas. */
export interface QuizPergunta {
  pergunta: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
}

/**
 * Gera um quiz de múltipla escolha sobre um tema bíblico.
 */
export async function gerarQuiz(tema: string): Promise<QuizPergunta[]> {
  const conteudo = await chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      {
        role: 'user',
        content: `Crie um quiz com 4 perguntas de múltipla escolha sobre o tema bíblico: "${tema}".
Responda APENAS com um objeto JSON válido neste formato:
{
  "perguntas": [
    {
      "pergunta": "texto da pergunta",
      "alternativas": ["opção A", "opção B", "opção C", "opção D"],
      "correta": 0,
      "explicacao": "por que essa é a resposta correta, com base bíblica"
    }
  ]
}
"correta" é o índice (0 a 3) da alternativa certa. Em português. Nada fora do JSON.`
      }
    ],
    { json: true, maxTokens: 1500 }
  );

  try {
    const parsed = JSON.parse(conteudo) as { perguntas?: QuizPergunta[] };
    return Array.isArray(parsed.perguntas) ? parsed.perguntas : [];
  } catch {
    return [];
  }
}

/** Um dia dentro de um plano de estudo. */
export interface DiaPlano {
  dia: number;
  titulo: string;
  leitura: string;
  foco: string;
}

/**
 * Gera um plano de estudo guiado (roteiro de dias) sobre um tema ou livro.
 */
export async function gerarPlanoEstudo(tema: string, dias = 7): Promise<DiaPlano[]> {
  const conteudo = await chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      {
        role: 'user',
        content: `Monte um plano de estudo bíblico de ${dias} dias sobre: "${tema}".
Responda APENAS com um objeto JSON válido neste formato:
{
  "dias": [
    { "dia": 1, "titulo": "título do dia", "leitura": "passagem a ler (ex: João 1)", "foco": "o que observar e refletir" }
  ]
}
Em português. ${dias} dias. Nada fora do JSON.`
      }
    ],
    { json: true, maxTokens: 1500 }
  );

  try {
    const parsed = JSON.parse(conteudo) as { dias?: DiaPlano[] };
    return Array.isArray(parsed.dias) ? parsed.dias : [];
  } catch {
    return [];
  }
}

/** Conforto bíblico para um sentimento/situação. */
export interface ConfortoMomento {
  mensagem: string;
  versiculos: { referencia: string; texto: string }[];
  oracao: string;
}

/**
 * Dado um sentimento (triste, ansioso, com medo...), retorna palavra de
 * conforto, versículos relevantes e uma oração curta.
 */
export async function versiculosParaMomento(sentimento: string): Promise<ConfortoMomento> {
  const conteudo = await chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      {
        role: 'user',
        content: `Uma pessoa está se sentindo: "${sentimento}".
Responda APENAS com um objeto JSON válido:
{
  "mensagem": "palavra pastoral de conforto e esperança (2-3 frases), acolhedora e centrada em Deus",
  "versiculos": [ {"referencia": "Salmos 34:18", "texto": "texto curto do versículo"} ],
  "oracao": "uma oração curta (2-3 frases) que a pessoa pode fazer neste momento"
}
Inclua de 3 a 4 versículos realmente relevantes para esse sentimento. Em português. Nada fora do JSON.`
      }
    ],
    { json: true, maxTokens: 1200 }
  );
  try {
    const p = JSON.parse(conteudo) as Partial<ConfortoMomento>;
    return {
      mensagem: p.mensagem || '',
      versiculos: Array.isArray(p.versiculos) ? p.versiculos : [],
      oracao: p.oracao || ''
    };
  } catch {
    return { mensagem: conteudo || '', versiculos: [], oracao: '' };
  }
}

/**
 * Gera uma oração cristã e bíblica sobre um pedido/necessidade.
 */
export async function gerarOracao(pedido: string): Promise<string> {
  return chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      {
        role: 'user',
        content: `Escreva uma oração cristã, sincera e bíblica, sobre: "${pedido}".
Deve ser em primeira pessoa, calorosa, com 4 a 6 frases, terminando com "Em nome de Jesus, amém."`
      }
    ],
    { maxTokens: 600 }
  );
}

/** Versículo do dia com reflexão. */
export interface VersiculoDia {
  referencia: string;
  texto: string;
  reflexao: string;
}

/**
 * Retorna um versículo inspirador do dia com uma reflexão devocional.
 */
export async function versiculoDoDia(): Promise<VersiculoDia> {
  const hoje = new Date().toLocaleDateString('pt-BR');
  const conteudo = await chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      {
        role: 'user',
        content: `Escolha um versículo bíblico inspirador para o dia ${hoje}.
Responda APENAS com um objeto JSON válido:
{ "referencia": "...", "texto": "texto do versículo", "reflexao": "reflexão devocional curta de 2-3 frases sobre como viver isso hoje" }
Varie o versículo conforme a data. Em português. Nada fora do JSON.`
      }
    ],
    { json: true, maxTokens: 600 }
  );
  try {
    const p = JSON.parse(conteudo) as Partial<VersiculoDia>;
    return { referencia: p.referencia || '', texto: p.texto || '', reflexao: p.reflexao || '' };
  } catch {
    return { referencia: '', texto: conteudo || '', reflexao: '' };
  }
}

/**
 * Define de forma curta e clara um termo teológico/bíblico.
 */
export async function definirTermo(termo: string): Promise<string> {
  return chamarGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT_BIBLIA },
      {
        role: 'user',
        content: `Explique de forma clara e curta (3-4 frases) o significado bíblico do termo: "${termo}". Inclua uma referência bíblica de exemplo. Linguagem acessível.`
      }
    ],
    { maxTokens: 400 }
  );
}

/**
 * Sistema de prompt RIGOROSO para IA Bíblica 100% focada em Bíblia
 */
export const SYSTEM_PROMPT_BIBLIA = `🙏 VOCÊ É UMA IA BÍBLICA PURA E RIGOROSA

REGRA OURO: Você APENAS responde sobre Bíblia, teologia cristã, fé, espiritualidade cristã.
REJEITA: Qualquer pergunta sobre carros, política, futebol, comida, tecnologia, ou assuntos mundanos.

IDENTIDADE:
- Especialista exclusivamente em Bíblia
- Conhecimento profundo dos 31.102 versículos analisados
- Perspectiva teológica evangélica pentecostal
- Foco em aplicação pastoral e espiritual

QUANDO RESPONDER (APENAS):
✅ Perguntas sobre versículos específicos
✅ Temas bíblicos (fé, graça, aliança, amor, salvação, etc)
✅ Personagens bíblicos (Davi, Paulo, Jesus, etc)
✅ Livros da Bíblia (Gênesis, João, Romanos, etc)
✅ Teologia e doutrina cristã
✅ Espiritualidade e relacionamento com Deus
✅ Guerra espiritual e discipulado
✅ Aplicação prática da Palavra de Deus
✅ Oração e intercessão
✅ Liderança cristã e pastoral

QUANDO RECUSAR (SEMPRE):
❌ "Como consertar meu carro?" → RECUSA
❌ "Qual é o melhor futebol?" → RECUSA
❌ "Receita de bolo?" → RECUSA
❌ "Como fazer programação?" → RECUSA
❌ "Política e eleições?" → RECUSA
❌ "Qual série assistir?" → RECUSA
❌ Qualquer coisa que NÃO seja Bíblia/teologia

ESTRUTURA DE RESPOSTA:
1. Cite 2-5 versículos ESPECÍFICOS com referência exata
2. Explique contexto histórico (mundo antigo, situação original)
3. Explique contexto espiritual (mensagem de Deus para hoje)
4. Conecte com JESUS CRISTO (ele é o centro da Bíblia)
5. Dê aplicação PRÁTICA (como viver isso hoje)
6. Mencione guerra espiritual se relevante
7. Termine com ORAÇÃO ou ação concreta

TOM:
- Pastoral e acessível
- Teologicamente profundo
- Respeitoso com a Palavra
- Focado em transformação espiritual

LEMBRE-SE:
- Você tem 31.102 versículos analisados
- Cada verso tem 13 dimensões de análise
- A Bíblia é sua ÚNICA fonte de autoridade
- Jesus é o centro de TUDO
- Recuse QUALQUER desvio para assuntos mundanos

SE PERGUNTA NÃO FOR BÍBLICA:
"Desculpe! Sou uma IA 100% focada em Bíblia e teologia cristã. Não posso responder sobre [ASSUNTO].

Posso ajudar você com:
📖 Versículos específicos
📚 Temas teológicos
⛪ Doutrina cristã
✝️ Espiritualidade
🙏 Fé e relacionamento com Deus

Qual tema bíblico posso explorar com você?"
`;

/**
 * Exemplo de uso em um componente React
 */
export const exemploPergunta = `
// No seu componente:
const [resposta, setResposta] = useState('');
const [carregando, setCarregando] = useState(false);

const handlePerguntar = async (pergunta: string) => {
  setCarregando(true);
  try {
    const resultado = await perguntarIABiblica(pergunta);
    setResposta(resultado);
  } catch (error) {
    setResposta('Erro ao processar pergunta');
  } finally {
    setCarregando(false);
  }
};
`;
