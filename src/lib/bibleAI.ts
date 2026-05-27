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
    'guerra espiritual', 'demônio', 'anjo', 'igreja', 'corpo de cristo'
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

  // Verifica palavras proibidas
  for (const proibido of assuntosProibidos) {
    if (perguntaLower.includes(proibido)) {
      return {
        valida: false,
        motivo: `❌ Desculpe! Essa pergunta é sobre "${proibido.toUpperCase()}", não sobre Bíblia. Sou uma IA 100% focada em teologia cristã.`
      };
    }
  }

  // Verifica se tem pelo menos uma palavra-chave bíblica
  const temPalavraChave = palavrasBiblicas.some(palavra => perguntaLower.includes(palavra));

  if (!temPalavraChave && pergunta.length < 15) {
    return {
      valida: false,
      motivo: '❓ Sua pergunta parece não ser sobre Bíblia. Tente perguntar sobre versículos, teologia, personagens bíblicos, ou temas cristãos.'
    };
  }

  return { valida: true };
}

// Chave do Groq exposta no cliente (Groq é gratuito - sem risco de custo).
// Funciona em hospedagem estatica (GitHub Pages) sem precisar de backend.
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Pergunta à IA Bíblica
 * Chama o Groq direto do navegador (client-side) com contexto da Bíblia Explicada Completa.
 * Não precisa de backend - funciona em hospedagem estática.
 */
export async function perguntarIABiblica(pergunta: string): Promise<string> {
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
