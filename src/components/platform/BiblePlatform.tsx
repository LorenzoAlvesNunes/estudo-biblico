"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Award,
  BookOpen,
  Bookmark,
  Bot,
  Brain,
  CalendarDays,
  CheckCircle2,
  Flame,
  Headphones,
  LayoutDashboard,
  Library,
  Lock,
  LogOut,
  Mail,
  Map,
  PenLine,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Trophy,
  UserPlus
} from "lucide-react";
import { books } from "@/data/bible";
import { addXp, getBiblePercent, getLevelName } from "@/lib/learning";
import {
  type AppUser,
  type UserProgress,
  emptyProgress,
  getStoredSession,
  loadProgress,
  login,
  logout,
  persistProgress,
  recoverPassword,
  register
} from "@/lib/userStore";
import { Particles } from "@/components/Particles";

gsap.registerPlugin(ScrollTrigger);

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Mode = "login" | "register" | "recover";

export function BiblePlatform() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);
  const [progress, setProgress] = useState<UserProgress>(emptyProgress);

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session);
      setProgress(loadProgress(session.id));
    }
    const timer = window.setTimeout(() => setLoading(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    persistProgress(user, progress);
  }, [progress, user]);

  useEffect(() => {
    if (loading || !user) return;
    gsap.utils.toArray(".reveal").forEach((item) => {
      gsap.fromTo(
        item as Element,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item as Element, start: "top 82%" }
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [loading, user]);

  async function handleLogout() {
    await logout();
    setUser(null);
    setProgress(emptyProgress);
  }

  if (loading) return <CinematicLoader />;

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-ink text-halo">
        <Particles />
        <AuthScreen
          onAuthenticated={(nextUser) => {
            setUser(nextUser);
            setProgress(loadProgress(nextUser.id));
          }}
        />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-halo">
      <Particles />
      <AppNav user={user} onLogout={handleLogout} />
      <div className="relative z-10">
        <Hero />
        <Dashboard progress={progress} />
        <StudyCenter progress={progress} setProgress={setProgress} />
        <QuizArena progress={progress} setProgress={setProgress} />
        <Devotional progress={progress} setProgress={setProgress} />
        <BibleAi />
      </div>
    </main>
  );
}

function CinematicLoader() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-16 w-16 rounded-full border border-gold-300/20 border-t-gold-300"
        />
        <p className="mt-6 text-sm uppercase tracking-[0.32em] text-gold-300">Lumen Scriptura</p>
      </div>
    </div>
  );
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (user: AppUser) => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("Lorenzo");
  const [email, setEmail] = useState("Lorenzoalzeny.com");
  const [password, setPassword] = useState("Bela1980@");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (mode === "login") onAuthenticated(await login(email, password));
      if (mode === "register") onAuthenticated(await register(name, email, password));
      if (mode === "recover") {
        await recoverPassword(email);
        setMessage("Se Supabase estiver configurado, o email de recuperacao sera enviado.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Algo deu errado.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative z-10 grid min-h-screen items-center px-5 py-12 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
      <div className="absolute inset-0 z-0">
        <img src={`${basePath}/assets/cinematic-bible-hero.png`} alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/86 to-ink/48" />
      </div>
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-300/30 bg-white/8 px-4 py-2 text-sm text-gold-100 backdrop-blur-xl">
          <ShieldCheck size={16} />
          Login primeiro. Jornada pessoal. Dados isolados.
        </div>
        <h1 className="text-5xl font-semibold leading-[1.02] text-halo sm:text-6xl xl:text-7xl">
          Estudo biblico <span className="gold-text">premium</span> para a vida inteira.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Uma experiencia de aprendizado com progresso individual, quizzes, devocionais, notas, favoritos, IA biblica e gamificacao.
        </p>
      </motion.div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, scale: 0.96, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass relative z-10 mt-10 rounded-lg p-6 lg:mt-0"
      >
        <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1">
          {(["login", "register", "recover"] as Mode[]).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setMode(item)}
              className={`h-10 flex-1 rounded-full text-sm font-semibold transition ${
                mode === item ? "bg-halo text-ink" : "text-white/58 hover:text-halo"
              }`}
            >
              {item === "login" ? "Login" : item === "register" ? "Cadastro" : "Senha"}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-halo">
          {mode === "login" ? "Entrar na jornada" : mode === "register" ? "Criar conta" : "Recuperar acesso"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/56">
          Demo inicial: <span className="text-gold-300">Lorenzoalzeny.com</span> / <span className="text-gold-300">Bela1980@</span>
        </p>

        {mode === "register" && (
          <Field icon={UserPlus} label="Nome" value={name} onChange={setName} autoComplete="name" />
        )}
        <Field icon={Mail} label="Email" value={email} onChange={setEmail} autoComplete="email" />
        {mode !== "recover" && (
          <Field icon={Lock} label="Senha" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        )}

        {message && <p className="mt-4 rounded-lg border border-gold-300/20 bg-gold-300/10 p-3 text-sm text-gold-100">{message}</p>}
        <button disabled={busy} className="mt-6 h-12 w-full rounded-full bg-halo font-semibold text-ink transition hover:bg-gold-100 disabled:opacity-60">
          {busy ? "Processando..." : mode === "login" ? "Entrar" : mode === "register" ? "Cadastrar" : "Enviar recuperacao"}
        </button>
      </motion.form>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  autoComplete
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm text-white/54">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-ink/54 px-4">
        <Icon size={17} className="text-gold-300" />
        <input
          value={value}
          type={type}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="h-full flex-1 bg-transparent text-white/80 outline-none"
        />
      </span>
    </label>
  );
}

function AppNav({ user, onLogout }: { user: AppUser; onLogout: () => void }) {
  const links = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["estudos", "Estudos", Library],
    ["quiz", "Quiz", Brain],
    ["devocional", "Devocional", Flame],
    ["ia", "IA", Bot]
  ] as const;

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-ink/64 px-4 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-300/40 bg-gold-300/10 text-gold-100">
            <BookOpen size={18} />
          </span>
          <span className="hidden text-sm font-semibold uppercase tracking-[0.24em] text-halo sm:block">Lumen</span>
        </a>
        <nav className="hide-scrollbar flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1">
          {links.map(([id, label, Icon]) => (
            <a key={id} href={`#${id}`} className="flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-sm text-white/62 transition hover:bg-white/10 hover:text-halo">
              <Icon size={15} />
              <span className="hidden md:inline">{label}</span>
            </a>
          ))}
        </nav>
        <button onClick={onLogout} className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm text-white/64 hover:text-halo" title={`Sair de ${user.email}`}>
          <LogOut size={15} />
          <span className="hidden lg:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[88vh] overflow-hidden px-5 pt-28 sm:px-8 lg:px-10">
      <div className="absolute inset-0">
        <img src={`${basePath}/assets/cinematic-bible-hero.png`} alt="" className="h-full w-full object-cover opacity-62" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/82 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/55" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[calc(88vh-7rem)] max-w-7xl items-center">
        <div className="max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-sm uppercase tracking-[0.28em] text-gold-300">
            Jornada personalizada
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-semibold leading-[1.02] sm:text-6xl xl:text-7xl">
            Aprenda toda a Biblia com profundidade, beleza e constancia.
          </motion.h1>
          <motion.blockquote initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.35, duration: 1 }} className="mt-7 border-l border-gold-300/70 pl-5 text-xl text-halo">
            "Lampada para os meus pes e luz para o meu caminho."
          </motion.blockquote>
          <a href="#dashboard" className="mt-9 inline-flex rounded-full bg-halo px-6 py-3 font-semibold text-ink transition hover:bg-gold-100">
            Começar Jornada
          </a>
        </div>
      </div>
    </section>
  );
}

function Dashboard({ progress }: { progress: UserProgress }) {
  const percent = getBiblePercent(progress, books.length);
  const stats = [
    ["Biblia estudada", `${percent}%`, BookOpen],
    ["Streak", `${progress.streak} dias`, Flame],
    ["Tempo total", `${progress.studiedMinutes} min`, Timer],
    ["Quizzes", String(progress.quizzesDone), Brain],
    ["Nivel espiritual", getLevelName(progress.level), Trophy],
    ["XP", String(progress.xp), Award]
  ] as const;

  return (
    <Section id="dashboard" eyebrow="Dashboard" title="Seu progresso individual, separado de todos os outros usuarios.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="glass reveal rounded-lg p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-white/55">{label}</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-300/10 text-gold-300">
                <Icon size={18} />
              </span>
            </div>
            <div className="text-3xl font-semibold text-halo">{value}</div>
          </div>
        ))}
      </div>
      <div className="glass reveal mt-5 rounded-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Progresso visual</h3>
          <span className="text-sm text-gold-300">{progress.completedBooks.length}/{books.length} livros</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-300 to-halo" animate={{ width: `${percent}%` }} />
        </div>
        <div className="mt-5 grid grid-cols-11 gap-2 md:grid-cols-22">
          {books.map((book: any) => (
            <span key={book.id} className={`aspect-square rounded-[4px] border ${progress.completedBooks.includes(book.id) ? "border-gold-300/50 bg-gold-300/40" : "border-white/10 bg-white/5"}`} title={book.name} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function StudyCenter({ progress, setProgress }: { progress: UserProgress; setProgress: React.Dispatch<React.SetStateAction<UserProgress>> }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>(books[0]);
  const [note, setNote] = useState(progress.notes[selected.id] ?? "");
  const filtered = useMemo(() => books.filter((book: any) => `${book.name} ${book.category} ${book.theme}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => setNote(progress.notes[selected.id] ?? ""), [progress.notes, selected.id]);

  function completeBook() {
    setProgress((current) => {
      const completedBooks = Array.from(new Set([...current.completedBooks, selected.id]));
      return addXp({ ...current, completedBooks, studiedMinutes: current.studiedMinutes + 20, recentActivity: [`Estudou ${selected.name}`, ...current.recentActivity].slice(0, 5) }, 120);
    });
  }

  function favorite() {
    setProgress((current) => ({ ...current, favorites: Array.from(new Set([...current.favorites, selected.name])) }));
  }

  function saveNote() {
    setProgress((current) => ({ ...current, notes: { ...current.notes, [selected.id]: note } }));
  }

  return (
    <Section id="estudos" eyebrow="Estudo Biblico" title="Escolha um livro e abra uma pagina interativa completa.">
      <div className="grid gap-5 xl:grid-cols-[.38fr_.62fr]">
        <aside className="glass reveal rounded-lg p-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-ink/50 px-4">
            <Search size={18} className="text-gold-300" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 flex-1 bg-transparent outline-none" placeholder="Pesquisar livro, tema ou categoria..." />
          </div>
          <div className="hide-scrollbar mt-4 grid max-h-[42rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1">
            {filtered.map((book: any) => (
              <button key={book.id} onClick={() => setSelected(book)} className={`rounded-lg border p-4 text-left transition ${selected.id === book.id ? "border-gold-300/55 bg-gold-300/12" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-halo">{book.name}</span>
                  {progress.completedBooks.includes(book.id) && <CheckCircle2 size={17} className="text-gold-300" />}
                </div>
                <p className="mt-2 text-sm text-white/52">{book.category}</p>
              </button>
            ))}
          </div>
        </aside>

        <article className="glass reveal rounded-lg p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gold-300">{selected.testament} / {selected.category}</p>
              <h3 className="mt-2 text-4xl font-semibold text-halo">{selected.name}</h3>
              <p className="mt-3 max-w-2xl leading-7 text-white/66">{selected.theme}</p>
            </div>
            <div className="flex gap-2">
              <IconButton title="Favoritar" icon={Bookmark} onClick={favorite} />
              <IconButton title="Concluir livro" icon={CheckCircle2} onClick={completeBook} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <StudyCard title="Autor" icon={PenLine} text={selected.author} />
            <StudyCard title="Data" icon={CalendarDays} text={selected.date} />
            <StudyCard title="Mapas e geografia" icon={Map} text={selected.map ?? selected.historicalContext?.[3]} />
            <StudyCard title="Arqueologia" icon={Star} text={selected.archaeology} />
          </div>

          <StudyList title="Linha do tempo" items={selected.timeline} />
          <StudyList title="Personagens" items={selected.characters} />
          <StudyList title="Resumo capitulo por capitulo" items={selected.chapters} />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextPanel title="Estudo teologico" text={selected.theology} />
            <TextPanel title="Jesus no livro" text={selected.jesus} />
            <TextPanel title="Aplicacoes" text={selected.practice} />
            <StudyList title="Palavras originais" items={selected.originalWords} compact />
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h4 className="font-semibold text-halo">Anotacoes privadas</h4>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-3 min-h-32 w-full resize-none rounded-lg border border-white/10 bg-ink/50 p-4 outline-none focus:border-gold-300/50" placeholder="Suas notas ficam salvas apenas no seu usuario." />
            <button onClick={saveNote} className="mt-3 rounded-full bg-halo px-5 py-2 font-semibold text-ink">Salvar nota</button>
          </div>
        </article>
      </div>
    </Section>
  );
}

function QuizArena({ progress, setProgress }: { progress: UserProgress; setProgress: React.Dispatch<React.SetStateAction<UserProgress>> }) {
  const questions = [
    { q: "Qual livro abre a narrativa da criacao?", a: "Genesis", options: ["Genesis", "Romanos", "Atos", "Salmos"] },
    { q: "Em qual evangelho Jesus e apresentado como o Verbo?", a: "Joao", options: ["Mateus", "Marcos", "Lucas", "Joao"] },
    { q: "Qual carta enfatiza fortemente justificacao pela fe?", a: "Romanos", options: ["Romanos", "Filemom", "Judas", "2 Joao"] }
  ];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const current = questions[index];

  function answer(option: string) {
    if (selected) return;
    setSelected(option);
    const correct = option === current.a;
    setProgress((value) => addXp({ ...value, quizzesDone: value.quizzesDone + 1, quizScores: { ...value.quizScores, [`quiz-${Date.now()}`]: correct ? 100 : 30 } }, correct ? 90 : 25));
  }

  return (
    <Section id="quiz" eyebrow="Quiz Interativo" title="XP, niveis, correcao animada e dificuldade progressiva.">
      <div className="glass reveal mx-auto max-w-4xl rounded-lg p-6">
        <div className="mb-5 flex justify-between text-sm text-white/58">
          <span>Pergunta {index + 1}/{questions.length}</span>
          <span>Nivel {progress.level}</span>
        </div>
        <h3 className="text-2xl font-semibold">{current.q}</h3>
        <div className="mt-6 grid gap-3">
          {current.options.map((option) => (
            <button key={option} onClick={() => answer(option)} className={`rounded-lg border p-4 text-left transition ${selected && option === current.a ? "border-emerald-300/50 bg-emerald-300/10" : selected === option ? "border-red-300/50 bg-red-300/10" : "border-white/10 bg-white/[0.04] hover:border-gold-300/40"}`}>
              {option}
            </button>
          ))}
        </div>
        <button onClick={() => { setSelected(null); setIndex((value) => (value + 1) % questions.length); }} className="mt-6 rounded-full bg-halo px-5 py-3 font-semibold text-ink">Proxima</button>
      </div>
    </Section>
  );
}

function Devotional({ progress, setProgress }: { progress: UserProgress; setProgress: React.Dispatch<React.SetStateAction<UserProgress>> }) {
  const [text, setText] = useState("");

  function saveDevotional() {
    setProgress((current) => addXp({ ...current, streak: Math.max(1, current.streak + 1), devotionalHistory: [new Date().toISOString(), ...current.devotionalHistory], recentActivity: ["Fez devocional diario", ...current.recentActivity].slice(0, 5) }, 60));
    setText("");
  }

  return (
    <Section id="devocional" eyebrow="Modo Devocional" title="Leitura, oracao, reflexao e historico espiritual.">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass reveal rounded-lg p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-gold-300">Hoje</p>
          <h3 className="mt-3 text-3xl font-semibold">Salmo 119:105</h3>
          <p className="mt-4 text-xl leading-8 text-white/78">Lampada para os meus pes e luz para o meu caminho.</p>
          <p className="mt-5 leading-7 text-white/64">A Palavra nao revela toda a estrada de uma vez; ela ilumina o proximo passo com fidelidade suficiente para obedecer.</p>
        </div>
        <div className="glass reveal rounded-lg p-6">
          <h3 className="text-2xl font-semibold">Pensamentos do dia</h3>
          <textarea value={text} onChange={(event) => setText(event.target.value)} className="mt-5 min-h-56 w-full resize-none rounded-lg border border-white/10 bg-ink/50 p-4 outline-none focus:border-gold-300/50" />
          <button onClick={saveDevotional} className="mt-4 rounded-full bg-halo px-5 py-3 font-semibold text-ink">Salvar devocional</button>
        </div>
      </div>
    </Section>
  );
}

function BibleAi() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Posso explicar versiculos, criar quizzes, resumir livros e sugerir aplicacoes praticas." }
  ]);
  const [input, setInput] = useState("");

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: input },
      { role: "assistant", text: `Estudo sugerido: leia o contexto, identifique o tema central, conecte com Cristo e aplique em obediencia. Pergunta: ${input}` }
    ]);
    setInput("");
  }

  return (
    <Section id="ia" eyebrow="IA Biblica" title="Chat para perguntas, resumos, quizzes e estudos guiados.">
      <div className="glass reveal overflow-hidden rounded-lg">
        <div className="max-h-[28rem] space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-lg border p-4 ${message.role === "user" ? "border-gold-300/25 bg-gold-300/12" : "border-white/10 bg-white/[0.05]"}`}>
                <p className="leading-7 text-white/76">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-3 border-t border-white/10 p-4">
          <input value={input} onChange={(event) => setInput(event.target.value)} className="h-12 flex-1 rounded-full border border-white/10 bg-ink/54 px-5 outline-none" placeholder="Pergunte sobre um texto, doutrina ou livro..." />
          <button className="grid h-12 w-12 place-items-center rounded-full bg-halo text-ink"><Send size={18} /></button>
        </form>
      </div>
    </Section>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">{eyebrow}</p>
          <h2 className="text-3xl font-semibold text-halo sm:text-4xl lg:text-5xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function IconButton({ title, icon: Icon, onClick }: { title: string; icon: React.ElementType; onClick: () => void }) {
  return (
    <button onClick={onClick} title={title} className="grid h-10 w-10 place-items-center rounded-full border border-gold-300/25 bg-gold-300/10 text-gold-300 transition hover:bg-gold-300/18">
      <Icon size={18} />
    </button>
  );
}

function StudyCard({ title, icon: Icon, text }: { title: string; icon: React.ElementType; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <Icon className="mb-3 text-gold-300" size={20} />
      <div className="text-sm text-white/48">{title}</div>
      <p className="mt-2 leading-6 text-white/76">{text}</p>
    </div>
  );
}

function StudyList({ title, items, compact = false }: { title: string; items: string[]; compact?: boolean }) {
  return (
    <div className={`${compact ? "" : "mt-5"} rounded-lg border border-white/10 bg-ink/34 p-4`}>
      <h4 className="font-semibold text-halo">{title}</h4>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-md bg-white/[0.05] px-3 py-2 text-sm leading-6 text-white/68">{item}</div>
        ))}
      </div>
    </div>
  );
}

function TextPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-gold-300/18 bg-gold-300/8 p-4">
      <h4 className="font-semibold text-gold-100">{title}</h4>
      <p className="mt-3 leading-7 text-white/70">{text}</p>
    </div>
  );
}
