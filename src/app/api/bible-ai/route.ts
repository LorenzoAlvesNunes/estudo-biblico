import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_BIBLIA } from '@/lib/bibleAI';

/**
 * API Endpoint: /api/bible-ai
 * Processa perguntas usando Claude com contexto bíblico
 */
export async function POST(request: NextRequest) {
  try {
    const { pergunta, contexto, versiculosRelevantes } = await request.json();

    if (!pergunta) {
      return NextResponse.json(
        { erro: 'Pergunta é obrigatória' },
        { status: 400 }
      );
    }

    // Constrói mensagem para Claude
    const userMessage = `
${contexto ? `Contexto bíblico:\n${contexto}\n\n` : ''}
Pergunta do usuário: ${pergunta}

Por favor, responda de forma pastoral, teológica e prática, citando versículos específicos quando apropriado.
`;

    // Chama Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT_BIBLIA,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Erro da Claude API:', response.statusText);
      return NextResponse.json(
        { erro: 'Erro ao processar pergunta' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const resposta = data.content[0]?.text || 'Não foi possível gerar resposta';

    // Formata resposta com versículos relevantes
    let respostaFormatada = resposta;

    if (versiculosRelevantes && versiculosRelevantes.length > 0) {
      respostaFormatada += `\n\n### Versículos Relacionados:\n`;
      versiculosRelevantes.forEach((v: any) => {
        respostaFormatada += `- **${v.referencia}** (${v.palavra_chave})\n`;
      });
    }

    return NextResponse.json({
      resposta: respostaFormatada,
      versiculosUsados: versiculosRelevantes?.length || 0
    });
  } catch (error) {
    console.error('Erro na API Bible AI:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
