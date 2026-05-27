'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, MessageSquare, Sparkles } from 'lucide-react';
import { perguntarIABiblica, type MensagemHistorico } from '@/lib/bibleAI';

interface Message {
  type: 'user' | 'ia';
  texto: string;
  versiculosUsados?: number;
}

export default function BibleAIChat() {
  const [pergunta, setPergunta] = useState('');
  const [mensagens, setMensagens] = useState<Message[]>([
    {
      type: 'ia',
      texto: '🙏 Olá! Sou a IA Bíblica do Lumen Scriptura, baseada na "Bíblia Explicada Completa" com análise de 31.102 versículos.\n\nPergunta-me sobre:\n• Versículos e suas explicações\n• Temas teológicos\n• Aplicação prática da Palavra\n• Conexão com Jesus Cristo\n• Guerra espiritual e discipulado\n\nComo posso ajudar você hoje?'
    }
  ]);
  const [carregando, setCarregando] = useState(false);

  const handleEnviar = async () => {
    if (!pergunta.trim()) return;

    // Adiciona pergunta do usuário
    const novasPergunta = pergunta;
    setPergunta('');

    // Monta o histórico da conversa (exceto a saudação inicial) para dar memória à IA
    const historico: MensagemHistorico[] = mensagens
      .slice(1)
      .map(msg => ({
        role: msg.type === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.texto
      }));

    setMensagens(prev => [...prev, { type: 'user', texto: novasPergunta }]);
    setCarregando(true);

    try {
      // Chama IA com o histórico da conversa
      const resposta = await perguntarIABiblica(novasPergunta, historico);

      // Adiciona resposta
      setMensagens(prev => [
        ...prev,
        {
          type: 'ia',
          texto: resposta,
          versiculosUsados: 5 // Pode melhorar para retornar do API
        }
      ]);
    } catch (error) {
      setMensagens(prev => [
        ...prev,
        {
          type: 'ia',
          texto: '❌ Desculpe, houve um erro ao processar sua pergunta. Tente novamente.'
        }
      ]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.035] p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-300/20">
          <Sparkles size={20} className="text-gold-300" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">IA Bíblica</h2>
          <p className="text-xs text-white/52">
            Baseada em 31.102 versículos analisados teologicamente
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="mb-4 max-h-[60vh] space-y-4 overflow-y-auto pr-2">
        {mensagens.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-3 text-sm leading-6 ${
                msg.type === 'user'
                  ? 'bg-gold-300/20 text-gold-100'
                  : 'border border-white/10 bg-white/[0.04] text-white/82'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.texto}</p>
              {msg.versiculosUsados && msg.type === 'ia' && (
                <p className="mt-2 text-xs text-white/45">
                  📖 {msg.versiculosUsados} versículos encontrados
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {carregando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="rounded-lg bg-white/[0.04] px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader className="animate-spin text-gold-300" size={16} />
                <span className="text-sm text-white/52">IA Bíblica pensando...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !carregando && handleEnviar()}
          placeholder="Pergunte sobre a Bíblia..."
          disabled={carregando}
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-white/82 outline-none transition placeholder:text-white/30 focus:border-gold-300/45 disabled:opacity-50"
        />
        <button
          onClick={handleEnviar}
          disabled={carregando || !pergunta.trim()}
          className="grid h-10 w-10 place-items-center rounded-lg bg-gold-300/20 text-gold-300 transition hover:bg-gold-300/30 disabled:opacity-50"
        >
          {carregando ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>

      {/* Sugestões */}
      <div className="mt-4 grid gap-2 text-xs">
        <p className="text-white/45">Tente perguntar:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Quem era Davi?',
            'O que significa aliança?',
            'Como confiar em Deus?',
            'Qual é a graça?'
          ].map((sugestao) => (
            <button
              key={sugestao}
              onClick={() => {
                setPergunta(sugestao);
              }}
              className="rounded-full border border-gold-300/30 bg-gold-300/5 px-3 py-1 text-white/64 transition hover:border-gold-300/60 hover:text-gold-300"
            >
              {sugestao}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
