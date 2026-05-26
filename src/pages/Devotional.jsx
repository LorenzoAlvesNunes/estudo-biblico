import { useState } from "react";
import { BookMarked, Feather, Heart } from "lucide-react";
import { Section } from "../components/Section";
import { devotion } from "../data/bible";

export function Devotional({ note, onNote }) {
  const [localNote, setLocalNote] = useState(note);

  function save() {
    onNote(localNote);
  }

  return (
    <Section id="devocional" eyebrow="Modo Devocional" title="Leitura diaria com oracao, reflexao e anotacoes.">
      <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <div className="glass rounded-lg p-6">
          <div className="flex items-center gap-3 text-gold-300">
            <BookMarked size={20} />
            <span className="text-sm uppercase tracking-[0.24em]">{devotion.date}</span>
          </div>
          <h3 className="mt-5 text-3xl font-semibold text-halo">{devotion.passage}</h3>
          <p className="mt-4 text-xl leading-8 text-white/78">{devotion.reading}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <Heart className="text-gold-300" size={20} />
              <h4 className="mt-3 font-semibold text-halo">Oracao</h4>
              <p className="mt-2 text-sm leading-6 text-white/64">{devotion.prayer}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <Feather className="text-gold-300" size={20} />
              <h4 className="mt-3 font-semibold text-halo">Reflexao</h4>
              <p className="mt-2 text-sm leading-6 text-white/64">{devotion.reflection}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-halo">Notas pessoais</h3>
          <textarea
            value={localNote}
            onChange={(event) => setLocalNote(event.target.value)}
            className="mt-5 min-h-72 w-full resize-none rounded-lg border border-white/10 bg-ink/50 p-4 leading-7 text-white/76 outline-none transition focus:border-gold-300/45"
            placeholder="Escreva suas observacoes, aplicacoes e oracoes..."
          />
          <button onClick={save} className="mt-4 rounded-full bg-halo px-5 py-3 font-semibold text-ink transition hover:bg-gold-100">
            Salvar anotacao
          </button>
        </div>
      </div>
    </Section>
  );
}
