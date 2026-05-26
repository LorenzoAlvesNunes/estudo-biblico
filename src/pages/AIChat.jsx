import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Section } from "../components/Section";

const starterMessages = [
  { role: "assistant", text: "Posso explicar versiculos, montar estudos, criar quizzes e sugerir aplicacoes praticas." },
  { role: "user", text: "Explique Romanos 8:1 de forma simples." },
  { role: "assistant", text: "Paulo afirma que quem esta em Cristo nao vive sob condenacao. A base nao e desempenho perfeito, mas uniao com Jesus e vida no Espirito." }
];

export function AIChat() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!input.trim()) return;

    const prompt = input.trim();
    setMessages((current) => [
      ...current,
      { role: "user", text: prompt },
      {
        role: "assistant",
        text: `Estudo gerado: observe o contexto, identifique o tema central, conecte com Cristo e finalize com uma aplicacao pratica para hoje. Pergunta recebida: "${prompt}".`
      }
    ]);
    setInput("");
  }

  return (
    <Section id="ia" eyebrow="IA Biblica" title="Um assistente para perguntas, versiculos, estudos e quizzes.">
      <div className="glass overflow-hidden rounded-lg">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-300/12 text-gold-300">
              <Bot size={20} />
            </span>
            <div>
              <h3 className="font-semibold text-halo">Lumen AI</h3>
              <p className="text-sm text-white/52">Pronto para integrar OpenAI, Firebase Functions ou Supabase Edge Functions.</p>
            </div>
          </div>
        </div>
        <div className="max-h-[34rem] space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-lg border p-4 ${message.role === "user" ? "border-gold-300/25 bg-gold-300/12" : "border-white/10 bg-white/[0.05]"}`}>
                <p className="leading-7 text-white/76">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-3 border-t border-white/10 p-4">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-ink/54 px-4">
            <Sparkles size={17} className="text-gold-300" />
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="h-12 flex-1 bg-transparent text-white/78 outline-none"
              placeholder="Pergunte sobre um texto, tema ou livro..."
            />
          </div>
          <button className="grid h-12 w-12 place-items-center rounded-full bg-halo text-ink transition hover:bg-gold-100" title="Enviar">
            <Send size={18} />
          </button>
        </form>
      </div>
    </Section>
  );
}
