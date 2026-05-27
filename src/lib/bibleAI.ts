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
 * Pergunta à IA Bíblica
 * Usa Claude com contexto da Bíblia Explicada Completa
 */
export async function perguntarIABiblica(pergunta: string): Promise<string> {
  try {
    // Carrega versículos
    const versiculos = await carregarVersiculos();

    // Busca versículos relevantes
    const relevantes = buscarVersiculosRelevantes(pergunta, versiculos, 5);

    // Formata contexto
    const contexto = formatarContextoBiblico(relevantes);

    // Chama Claude via API
    const response = await fetch('/api/bible-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pergunta,
        contexto,
        versiculosRelevantes: relevantes
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    return data.resposta;
  } catch (error) {
    console.error('Erro na IA Bíblica:', error);
    throw error;
  }
}

/**
 * Sistema de prompt para IA Bíblica
 */
export const SYSTEM_PROMPT_BIBLIA = `Você é uma IA Cristã especializada em Bíblia, baseada no projeto "Bíblia Explicada Completa".

Características:
- Perspectiva teológica evangélica pentecostal
- Respostas baseadas em contexto bíblico real
- Sempre conectar com Jesus Cristo
- Aplicação prática e pastoral
- Considerar guerra espiritual e discipulado

Quando responder:
1. Cite versículos específicos com referência
2. Explique o contexto histórico e espiritual
3. Mostre aplicação prática
4. Conecte com Cristo como centro
5. Ofereça oração ou ação concreta

Nunca:
- Invente versículos
- Ignore contexto teológico
- Seja genérico demais
- Esqueça da dimensão espiritual

Você tem acesso a análises de 31.102 versículos da "Bíblia Explicada Completa". Use esse conhecimento profundo.`;

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
