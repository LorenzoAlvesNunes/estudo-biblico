import { useMemo, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Compass,
  History,
  Layers3,
  Map,
  ScrollText,
  Search,
  Sparkles,
  Star,
  UsersRound
} from "lucide-react";
import { Section } from "../components/Section";
import { books, studyCollections } from "../data/bible";

const filters = ["Todos", "Antigo Testamento", "Novo Testamento"];

export function Study({ onFavorite }) {
  const [selected, setSelected] = useState(books[0]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesFilter = filter === "Todos" || book.testament === filter;
      const text = `${book.name} ${book.category} ${book.theme}`.toLowerCase();
      return matchesFilter && text.includes(query.toLowerCase());
    });
  }, [filter, query]);

  return (
    <Section id="estudo" eyebrow="Centro de Estudos" title="Escolha qualquer livro da Biblia e estude em profundidade.">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {studyCollections.map((item) => (
          <div key={item.label} className="glass rounded-lg p-5">
            <div className="text-sm text-white/52">{item.label}</div>
            <div className="mt-2 text-3xl font-semibold text-halo">{item.count}</div>
            <div className="mt-2 h-px bg-gold-line" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[.42fr_.58fr]">
        <aside className="glass rounded-lg p-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-ink/50 px-4">
            <Search size={18} className="text-gold-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 flex-1 bg-transparent text-white/78 outline-none"
              placeholder="Buscar livro, categoria ou tema..."
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  filter === item
                    ? "border-gold-300/50 bg-gold-300/14 text-gold-100"
                    : "border-white/10 bg-white/[0.04] text-white/58 hover:text-halo"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hide-scrollbar mt-4 grid max-h-[48rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => setSelected(book)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selected.id === book.id
                    ? "border-gold-300/55 bg-gold-300/12"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-halo">{book.name}</span>
                  <span className="text-sm text-gold-300">{book.progress}%</span>
                </div>
                <p className="mt-2 text-sm text-white/52">{book.category}</p>
              </button>
            ))}
          </div>
        </aside>

        <article className="glass rounded-lg p-5 sm:p-6">
          <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gold-300">{selected.testament} / {selected.category}</p>
              <h3 className="mt-2 text-4xl font-semibold text-halo">{selected.name}</h3>
              <p className="mt-3 max-w-2xl leading-7 text-white/64">{selected.theme}</p>
            </div>
            <button
              onClick={() => onFavorite(selected.name)}
              className="inline-flex items-center gap-2 rounded-full border border-gold-300/30 bg-gold-300/10 px-4 py-2 text-sm text-gold-100 transition hover:bg-gold-300/18"
            >
              <Bookmark size={16} />
              Favoritar
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Info title="Autor" value={selected.author} icon={ScrollText} />
            <Info title="Data" value={selected.date} icon={History} />
            <Info title="Proposito" value={selected.purpose} icon={Compass} />
            <Info title="Importancia espiritual" value={selected.spiritualImportance} icon={Sparkles} />
          </div>

          <StudyBlock title="Contexto historico" icon={Map} items={selected.historicalContext} />
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Panel title="Linha do tempo" icon={Layers3} items={selected.timeline} />
            <Panel title="Personagens principais" icon={UsersRound} items={selected.characters} />
            <Panel title="Versiculos-chave" icon={Star} items={selected.keyVerses} />
            <Panel title="Resumo capitulo por capitulo" icon={ScrollText} items={selected.chapters} />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextPanel title="Estudo teologico profundo" text={selected.theology} />
            <TextPanel title="Jesus no livro" text={selected.jesus} />
            <Panel title="Hebraico e grego" icon={CheckCircle2} items={selected.originalWords} />
            <TextPanel title="Curiosidades biblicas e arqueologia" text={selected.archaeology} />
            <Panel title="Erros de interpretacao" icon={CheckCircle2} items={selected.interpretationErrors} />
            <TextPanel title="Aplicacao pratica" text={selected.practice} />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-gold-300/18 bg-gold-300/8 p-4">
              <h4 className="font-semibold text-gold-100">Devocional</h4>
              <p className="mt-3 text-sm leading-6 text-white/70">{selected.devotional.reflection}</p>
              <p className="mt-3 text-sm leading-6 text-white/70">{selected.devotional.teaching}</p>
              <p className="mt-3 text-sm leading-6 text-white/70">{selected.devotional.prayer}</p>
            </div>
            <Panel title="Quiz biblico" icon={Star} items={selected.quiz} />
          </div>
        </article>
      </div>
    </Section>
  );
}

function Info({ title, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <Icon className="mb-3 text-gold-300" size={20} />
      <div className="text-sm text-white/48">{title}</div>
      <p className="mt-2 leading-6 text-white/76">{value}</p>
    </div>
  );
}

function StudyBlock({ title, icon: Icon, items }) {
  return (
    <div className="mt-5 rounded-lg border border-white/10 bg-ink/34 p-4">
      <div className="flex items-center gap-2">
        <Icon className="text-gold-300" size={18} />
        <h4 className="font-semibold text-halo">{title}</h4>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-md bg-white/[0.05] px-3 py-2 text-sm leading-6 text-white/68">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, items }) {
  return (
    <div className="rounded-lg border border-white/10 bg-ink/34 p-4">
      <div className="flex items-center gap-2">
        <Icon className="text-gold-300" size={18} />
        <h4 className="font-semibold text-halo">{title}</h4>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-md bg-white/[0.05] px-3 py-2 text-sm leading-6 text-white/68">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TextPanel({ title, text }) {
  return (
    <div className="rounded-lg border border-gold-300/18 bg-gold-300/8 p-4">
      <h4 className="font-semibold text-gold-100">{title}</h4>
      <p className="mt-3 leading-7 text-white/70">{text}</p>
    </div>
  );
}
