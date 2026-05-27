import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_BIBLIA } from '@/lib/bibleAI';

/**
 * API Endpoint: /api/bible-ai
 * Processa perguntas usando Groq (Llama 3.1) com contexto bíblico
 * Gratuito e ilimitado!
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

    // Constrói mensagem para Groq
    const userMessage = `
${contexto ? `Contexto bíblico:\n${contexto}\n\n` : ''}
Pergunta do usuário: ${pergunta}

Por favor, responda de forma pastoral, teológica e prática, citando versículos específicos quando apropriado.
`;

    // Chama Groq API (Llama 3.1 70B - Gratuito!)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT_BIBLIA
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro da Groq API:', error);
      return NextResponse.json(
        { erro: 'Erro ao processar pergunta' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const resposta = data.choices[0]?.message?.content || 'Não foi possível gerar resposta';

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
      versiculosUsados: versiculosRelevantes?.length || 0,
      modelo: 'Llama 3.1 70B (Groq)'
    });
  } catch (error) {
    console.error('Erro na API Bible AI:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
