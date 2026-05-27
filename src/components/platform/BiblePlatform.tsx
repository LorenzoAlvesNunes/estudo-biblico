"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flame,
  GraduationCap,
  Home,
  Library,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PenLine,
  Plus,
  Search,
  Type,
  X
} from "lucide-react";
import { books } from "@/data/bible";
import { addXp, getLevelName } from "@/lib/learning";
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

type AuthMode = "login" | "register" | "recover";
type AppView = "dashboard" | "study" | "bible-study" | "sermons";
type BibleBook = (typeof books)[number] & {
  id: string;
  name: string;
  testament: string;
  category: string;
  author: string;
  date: string;
  theme: string;
  purpose: string;
  historicalContext: string[];
  timeline: string[];
  characters: string[];
  keyVerses: string[];
  chapters: string[];
  theology: string;
  jesus: string;
  originalWords: string[];
  archaeology: string;
  practice: string;
};
type SermonDraft = UserProgress["sermons"][number];

const chapterCounts: Record<string, number> = {
  Genesis: 50,
  Exodo: 40,
  Levitico: 27,
  Numeros: 36,
  Deuteronomio: 34,
  Josue: 24,
  Juizes: 21,
  Rute: 4,
  "1 Samuel": 31,
  "2 Samuel": 24,
  "1 Reis": 22,
  "2 Reis": 25,
  "1 Cronicas": 29,
  "2 Cronicas": 36,
  Esdras: 10,
  Neemias: 13,
  Ester: 10,
  Jo: 42,
  Salmos: 150,
  Proverbios: 31,
  Eclesiastes: 12,
  Cantares: 8,
  Isaias: 66,
  Jeremias: 52,
  Lamentacoes: 5,
  Ezequiel: 48,
  Daniel: 12,
  Oseias: 14,
  Joel: 3,
  Amos: 9,
  Obadias: 1,
  Jonas: 4,
  Miqueias: 7,
  Naum: 3,
  Habacuque: 3,
  Sofonias: 3,
  Ageu: 2,
  Zacarias: 14,
  Malaquias: 4,
  Mateus: 28,
  Marcos: 16,
  Lucas: 24,
  Joao: 21,
  Atos: 28,
  Romanos: 16,
  "1 Corintios": 16,
  "2 Corintios": 13,
  Galatas: 6,
  Efesios: 6,
  Filipenses: 4,
  Colossenses: 4,
  "1 Tessalonicenses": 5,
  "2 Tessalonicenses": 3,
  "1 Timoteo": 6,
  "2 Timoteo": 4,
  Tito: 3,
  Filemom: 1,
  Hebreus: 13,
  Tiago: 5,
  "1 Pedro": 5,
  "2 Pedro": 3,
  "1 Joao": 5,
  "2 Joao": 1,
  "3 Joao": 1,
  Judas: 1,
  Apocalipse: 22
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function BiblePlatform() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);
  const [progress, setProgress] = useState<UserProgress>(emptyProgress);
  const [view, setView] = useState<AppView>("dashboard");
  const [selectedBook, setSelectedBook] = useState<BibleBook>(books[0] as BibleBook);
  const [chapter, setChapter] = useState(1);

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session);
      setProgress(loadProgress(session.id));
    }
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    persistProgress(user, progress);
  }, [progress, user]);

  async function handleLogout() {
    await logout();
    setUser(null);
    setProgress(emptyProgress);
    setView("dashboard");
  }

  function openStudy(book: BibleBook, nextChapter = 1) {
    setSelectedBook(book);
    setChapter(nextChapter);
    setView("study");
  }

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <main className="min-h-screen bg-study text-halo">
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
    <main className="min-h-screen bg-study text-halo">
      <TopBar user={user} view={view} onNavigate={setView} onLogout={handleLogout} />
      <AnimatePresence mode="wait">
        {view === "dashboard" && (
          <Dashboard
            key="dashboard"
            progress={progress}
            onOpenStudy={openStudy}
            onNavigate={setView}
          />
        )}
        {view === "study" && (
          <StudyWorkspace
            key="study"
            book={selectedBook}
            chapter={chapter}
            setChapter={setChapter}
            progress={progress}
            setProgress={setProgress}
            onBack={() => setView("dashboard")}
          />
        )}
        {view === "bible-study" && (
          <BibleStudyCenter key="bible-study" progress={progress} setProgress={setProgress} />
        )}
        {view === "sermons" && (
          <SermonsStudio key="sermons" progress={progress} setProgress={setProgress} />
        )}
      </AnimatePresence>
    </main>
  );
}

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-study text-halo">
      <div className="text-center">
        <motion.div
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.96, 1, 0.96] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto h-12 w-12 rounded-full border border-gold-300/25 border-t-gold-300"
        />
        <p className="mt-5 text-sm uppercase tracking-[0.28em] text-white/50">Preparando estudo</p>
      </div>
    </div>
  );
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (user: AppUser) => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
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
        setMessage("Se o Supabase estiver configurado, voce recebera o email de recuperacao.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel continuar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative grid min-h-screen overflow-hidden px-5 py-8 lg:grid-cols-[1fr_460px] lg:px-12">
      <div className="absolute inset-0">
        <img src={`${basePath}/assets/cinematic-bible-hero.png`} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(230,198,106,.16),transparent_32rem),linear-gradient(90deg,#050505_0%,rgba(5,5,5,.92)_45%,rgba(5,5,5,.74)_100%)]" />
      </div>

      <div className="relative z-10 flex items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <span className="mb-5 inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/62 backdrop-blur-xl">
            Estudo biblico organizado, pessoal e profundo
          </span>
          <h1 className="text-5xl font-semibold leading-[1.02] text-halo sm:text-6xl">
            Um lugar calmo para estudar a Biblia.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Leia por capitulos, acompanhe progresso, escreva notas e revise com quizzes simples, sem distracao visual.
          </p>
        </motion.div>
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="relative z-10 mt-10 self-center rounded-2xl border border-white/10 bg-[#0c0c0e]/82 p-6 shadow-[0_28px_90px_rgba(0,0,0,.42)] backdrop-blur-2xl lg:mt-0"
      >
        <div className="mb-7 grid grid-cols-3 rounded-full border border-white/10 bg-white/[0.04] p-1">
          {(["login", "register", "recover"] as AuthMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`h-10 rounded-full text-sm font-medium transition ${mode === item ? "bg-halo text-ink" : "text-white/52 hover:text-white"}`}
            >
              {item === "login" ? "Entrar" : item === "register" ? "Conta" : "Senha"}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold">{mode === "login" ? "Bem-vindo de volta" : mode === "register" ? "Criar nova conta" : "Recuperar senha"}</h2>
        <p className="mt-2 text-sm leading-6 text-white/50">Demo: Lorenzoalzeny.com / Bela1980@</p>

        {mode === "register" && <Input icon={PenLine} label="Nome" value={name} onChange={setName} />}
        <Input icon={Mail} label="Email" value={email} onChange={setEmail} />
        {mode !== "recover" && <Input icon={Lock} label="Senha" type="password" value={password} onChange={setPassword} />}

        {message && <p className="mt-4 rounded-xl border border-gold-300/20 bg-gold-300/10 p-3 text-sm text-gold-100">{message}</p>}

        <button disabled={busy} className="mt-6 h-12 w-full rounded-full bg-halo font-semibold text-ink transition hover:bg-gold-100 disabled:opacity-60">
          {busy ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "register" ? "Criar conta" : "Enviar email"}
        </button>
      </motion.form>
    </section>
  );
}

function Input({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text"
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm text-white/54">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-gold-300/45">
        <Icon size={17} className="text-gold-300/85" />
        <input value={value} type={type} onChange={(event) => onChange(event.target.value)} className="h-full flex-1 bg-transparent text-white/82 outline-none" />
      </span>
    </label>
  );
}

function TopBar({ user, view, onNavigate, onLogout }: { user: AppUser; view: AppView; onNavigate: (view: AppView) => void; onLogout: () => void }) {
  const navItems = [
    { id: "dashboard" as const, label: "Inicio", icon: Home },
    { id: "study" as const, label: "Curso", icon: Library },
    { id: "bible-study" as const, label: "Estudo Biblico", icon: MessageSquare },
    { id: "sermons" as const, label: "Pregacoes", icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#08080a]/82 px-4 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3">
        <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-gold-300/25 bg-gold-300/10 text-gold-300">
            <BookOpen size={18} />
          </span>
          <span className="font-semibold tracking-wide">Lumen Scriptura</span>
        </button>
        <div className="hide-scrollbar hidden max-w-[58vw] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm transition ${view === item.id ? "bg-white/10 text-halo" : "text-white/52 hover:text-white"}`}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-white/46 sm:block">{user.name}</span>
          <button onClick={onLogout} title="Sair" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition hover:text-white">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

function Dashboard({
  progress,
  onOpenStudy,
  onNavigate
}: {
  progress: UserProgress;
  onOpenStudy: (book: BibleBook, chapter?: number) => void;
  onNavigate: (view: AppView) => void;
}) {
  const [query, setQuery] = useState("");
  const filteredBooks = useMemo(() => {
    const search = query.toLowerCase();
    return (books as BibleBook[]).filter((book) => `${book.name} ${book.category} ${book.theme}`.toLowerCase().includes(search));
  }, [query]);
  const oldBooks = filteredBooks.filter((book) => book.testament === "Antigo Testamento");
  const newBooks = filteredBooks.filter((book) => book.testament === "Novo Testamento");
  const totalChapters = getTotalChapters();
  const completedChapters = getCompletedChapterCount(progress);
  const percent = Math.round((completedChapters / totalChapters) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-[1500px] px-5 py-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-gold-300/80">Dashboard</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">Escolha um livro e continue uma jornada simples de leitura.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/56">A plataforma agora prioriza leitura, clareza, notas e progresso por capitulo. Sem excesso. Sem ruido.</p>
          <button onClick={() => onOpenStudy(books[0] as BibleBook, 1)} className="mt-7 inline-flex items-center gap-2 rounded-full bg-halo px-5 py-3 font-semibold text-ink transition hover:bg-gold-100">
            Comecar Genesis
            <ArrowRight size={17} />
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => onNavigate("bible-study")} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/64 transition hover:text-white">Perguntar sobre a Biblia</button>
            <button onClick={() => onNavigate("sermons")} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/64 transition hover:text-white">Criar pregacao</button>
          </div>
        </div>

        <div className="grid gap-3">
          <Metric label="Progresso" value={`${percent}%`} detail={`${completedChapters} de ${totalChapters} capitulos`} />
          <Metric label="Streak" value={`${progress.streak} dias`} detail="ritmo de leitura" />
          <Metric label="Nivel" value={getLevelName(progress.level)} detail={`${progress.xp} XP acumulado`} />
          <Metric label="Quizzes e provas" value={`${progress.quizzesDone}/${progress.examsDone}`} detail="atividades concluidas" />
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-[#0b0b0d]/76 p-5 shadow-soft">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Biblioteca biblica</h2>
            <p className="mt-1 text-sm text-white/46">66 livros organizados para estudo progressivo.</p>
          </div>
          <label className="flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 md:w-80">
            <Search size={17} className="text-white/42" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar livro..." className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>

        <BookGroup title="Antigo Testamento" books={oldBooks} progress={progress} onOpenStudy={onOpenStudy} />
        <BookGroup title="Novo Testamento" books={newBooks} progress={progress} onOpenStudy={onOpenStudy} />
      </section>
    </motion.div>
  );
}

function BookGroup({
  title,
  books,
  progress,
  onOpenStudy
}: {
  title: string;
  books: BibleBook[];
  progress: UserProgress;
  onOpenStudy: (book: BibleBook, chapter?: number) => void;
}) {
  if (books.length === 0) return null;

  return (
    <div className="mt-6 first:mt-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300/70">{title}</h3>
        <span className="text-sm text-white/34">{books.length} livros</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => {
          const done = progress.completedChapters[book.id]?.length ?? 0;
          const total = getChapterCount(book);
          return (
            <button key={book.id} onClick={() => onOpenStudy(book, Math.min(done + 1, total))} className="group rounded-2xl border border-white/9 bg-white/[0.03] p-4 text-left transition hover:-translate-y-0.5 hover:border-gold-300/28 hover:bg-white/[0.055]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-halo">{book.name}</h3>
                  <p className="mt-1 text-sm text-white/42">{book.category}</p>
                </div>
                <span className="text-xs text-gold-300/80">{Math.round((done / total) * 100)}%</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
                <div className="h-full rounded-full bg-gold-300/80 transition-all" style={{ width: `${(done / total) * 100}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StudyWorkspace({
  book,
  chapter,
  setChapter,
  progress,
  setProgress,
  onBack
}: {
  book: BibleBook;
  chapter: number;
  setChapter: (chapter: number) => void;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  onBack: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const chapters = getChapterCount(book);
  const completed = progress.completedChapters[book.id] ?? [];
  const isRead = completed.includes(chapter);
  const noteKey = `${book.id}:${chapter}`;
  const [note, setNote] = useState(progress.notes[noteKey] ?? "");

  useEffect(() => {
    setNote(progress.notes[noteKey] ?? "");
  }, [noteKey, progress.notes]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress((current) => {
        if ((current.notes[noteKey] ?? "") === note) return current;
        return { ...current, notes: { ...current.notes, [noteKey]: note } };
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [note, noteKey, setProgress]);

  function markAsRead() {
    setProgress((current) => {
      const currentChapters = current.completedChapters[book.id] ?? [];
      const nextChapters = Array.from(new Set([...currentChapters, chapter])).sort((a, b) => a - b);
      const completedChapters = { ...current.completedChapters, [book.id]: nextChapters };
      const completedBooks = nextChapters.length === chapters ? Array.from(new Set([...current.completedBooks, book.id])) : current.completedBooks;
      return addXp({
        ...current,
        completedChapters,
        completedBooks,
        studiedMinutes: current.studiedMinutes + 12,
        recentActivity: [`Leu ${book.name} ${chapter}`, ...current.recentActivity].slice(0, 6)
      }, 35);
    });
    setQuizOpen(true);
  }

  function nextChapter() {
    setChapter(Math.min(chapter + 1, chapters));
  }

  function favoriteVerse() {
    const verse = getKeyVerse(book, chapter);
    setProgress((current) => ({
      ...current,
      favoriteVerses: Array.from(new Set([...current.favoriteVerses, verse])),
      favorites: Array.from(new Set([...current.favorites, `${book.name} ${chapter}`]))
    }));
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
      <button onClick={() => setSidebarOpen(true)} className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-halo text-ink shadow-soft lg:hidden">
        <Menu size={19} />
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/55 lg:hidden">
            <motion.div initial={{ x: -340 }} animate={{ x: 0 }} exit={{ x: -340 }} className="h-full w-[86vw] max-w-sm bg-[#09090b]">
              <StudySidebar book={book} chapter={chapter} setChapter={(value) => { setChapter(value); setSidebarOpen(false); }} progress={progress} onBack={onBack} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r border-white/8 lg:block">
        <StudySidebar book={book} chapter={chapter} setChapter={setChapter} progress={progress} onBack={onBack} />
      </aside>

      <article className="min-h-[calc(100vh-4rem)] px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-white/48 transition hover:text-white">
            <ChevronLeft size={16} />
            Voltar para biblioteca
          </button>

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-gold-300/80">Curso de {book.name}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStep label="1. Estudar" active />
              <MiniStep label="2. Quiz" active={isRead} />
              <MiniStep label="3. Prova" active={canTakeExam(progress, book, chapter)} />
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-gold-300/80">{book.name}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Capitulo {chapter}</h1>
            <p className="mt-4 leading-7 text-white/58">{buildChapterIntro(book, chapter)}</p>
          </div>

          <ReadingCard book={book} chapter={chapter} fontSize={fontSize} setFontSize={setFontSize} onFavorite={favoriteVerse} />

          <StudySection title="Resumo" text={buildSummary(book, chapter)} />
          <StudySection title="Explicacao e contexto" text={buildExplanation(book, chapter)} />
          <InsightGrid book={book} chapter={chapter} />
          <StudySection title="O que isso revela sobre Jesus" text={book.jesus} />
          <StudySection title="Aplicacao pratica" text={book.practice} />
          <ExamPanel book={book} chapter={chapter} progress={progress} setProgress={setProgress} />

          <div className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row">
            <button onClick={markAsRead} className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold transition ${isRead ? "border border-gold-300/25 bg-gold-300/10 text-gold-100" : "bg-halo text-ink hover:bg-gold-100"}`}>
              <Check size={17} />
              {isRead ? "Capitulo lido" : "Marcar como lido"}
            </button>
            <button onClick={nextChapter} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 font-semibold text-white/72 transition hover:border-white/20 hover:text-white">
              Proximo capitulo
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </article>

      <aside className="border-t border-white/8 px-5 py-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-l lg:border-t-0 lg:px-5">
        <NotesPanel book={book} chapter={chapter} note={note} setNote={setNote} progress={progress} />
      </aside>

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} book={book} chapter={chapter} setProgress={setProgress} />
    </motion.div>
  );
}

function MiniStep({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${active ? "border-gold-300/24 bg-gold-300/[0.08] text-gold-100" : "border-white/8 bg-white/[0.025] text-white/38"}`}>
      {label}
    </div>
  );
}

function StudySidebar({
  book,
  chapter,
  setChapter,
  progress,
  onBack
}: {
  book: BibleBook;
  chapter: number;
  setChapter: (chapter: number) => void;
  progress: UserProgress;
  onBack: () => void;
}) {
  const total = getChapterCount(book);
  const completed = progress.completedChapters[book.id] ?? [];
  const percent = Math.round((completed.length / total) * 100);

  return (
    <div className="flex h-full flex-col p-5">
      <button onClick={onBack} className="mb-5 flex items-center gap-2 text-sm text-white/48 transition hover:text-white">
        <ChevronLeft size={16} />
        Biblioteca
      </button>
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-300/75">{book.category}</p>
        <h2 className="mt-2 text-2xl font-semibold">{book.name}</h2>
        <p className="mt-2 text-sm leading-6 text-white/50">Capitulo atual: {chapter}</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-gold-300/85" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-xs text-white/42">{percent}% concluido</p>
      </div>

      <div className="hide-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: total }).map((_, index) => {
            const value = index + 1;
            const done = completed.includes(value);
            const active = chapter === value;
            return (
              <button
                key={value}
                onClick={() => setChapter(value)}
                className={`h-11 rounded-xl border text-sm transition ${
                  active
                    ? "border-gold-300/50 bg-gold-300/16 text-gold-100"
                    : done
                      ? "border-white/10 bg-white/[0.07] text-white/74"
                      : "border-white/8 bg-white/[0.025] text-white/42 hover:text-white"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReadingCard({
  book,
  chapter,
  fontSize,
  setFontSize,
  onFavorite
}: {
  book: BibleBook;
  chapter: number;
  fontSize: number;
  setFontSize: (value: number) => void;
  onFavorite: () => void;
}) {
  const keyVerse = getKeyVerse(book, chapter);
  return (
    <section className="rounded-3xl border border-white/10 bg-[#101012]/72 p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/42">Leitura biblica</p>
          <h2 className="mt-1 text-2xl font-semibold">{book.name} {chapter}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFontSize(Math.max(16, fontSize - 1))} title="Diminuir fonte" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition hover:text-white">
            <Type size={15} />
          </button>
          <button onClick={() => setFontSize(Math.min(22, fontSize + 1))} title="Aumentar fonte" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition hover:text-white">
            <Type size={19} />
          </button>
          <button onClick={onFavorite} title="Favoritar versiculo-chave" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition hover:text-gold-300">
            <Bookmark size={17} />
          </button>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-gold-300/14 bg-gold-300/[0.06] p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-300/70">Versiculo-chave</p>
        <p className="mt-3 leading-8 text-halo" style={{ fontSize }}>{keyVerse}</p>
      </div>
      <p className="mt-5 leading-8 text-white/64" style={{ fontSize }}>
        Leitura guiada: abra sua Biblia em {book.name} {chapter}. Leia com calma, marque palavras repetidas e observe quem fala, quem age, qual conflito aparece e como Deus conduz a narrativa.
      </p>
    </section>
  );
}

function StudySection({ title, text }: { title: string; text: string }) {
  return (
    <section className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 leading-8 text-white/62">{text}</p>
    </section>
  );
}

function InsightGrid({ book, chapter }: { book: BibleBook; chapter: number }) {
  const items = [
    ["Ponto importante", book.timeline?.[chapter % book.timeline.length] ?? book.theme],
    ["Personagem", book.characters?.[chapter % book.characters.length] ?? "Povo de Deus"],
    ["Licao espiritual", `Deus forma discernimento, obediencia e maturidade por meio deste texto em ${book.name}.`],
    ["Palavra-chave", book.originalWords?.[chapter % book.originalWords.length] ?? "fe"]
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map(([title, text]) => (
        <div key={title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <p className="text-sm text-gold-300/70">{title}</p>
          <p className="mt-2 leading-7 text-white/64">{text}</p>
        </div>
      ))}
    </div>
  );
}

function ExamPanel({
  book,
  chapter,
  progress,
  setProgress
}: {
  book: BibleBook;
  chapter: number;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}) {
  const start = Math.floor((chapter - 1) / 5) * 5 + 1;
  const end = Math.min(start + 4, getChapterCount(book));
  const examId = `${book.id}:${start}-${end}`;
  const completedInRange = (progress.completedChapters[book.id] ?? []).filter((item) => item >= start && item <= end).length;
  const unlocked = completedInRange === end - start + 1;
  const done = progress.completedExams.includes(examId);

  function completeExam() {
    if (!unlocked || done) return;
    setProgress((current) => addXp({
      ...current,
      examsDone: current.examsDone + 1,
      completedExams: Array.from(new Set([...current.completedExams, examId])),
      recentActivity: [`Prova ${book.name} ${start}-${end}`, ...current.recentActivity].slice(0, 6)
    }, 160));
  }

  return (
    <section className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold-300/70">Prova final</p>
          <h3 className="mt-2 text-lg font-semibold">{book.name} {start}-{end}</h3>
          <p className="mt-2 text-sm leading-6 text-white/48">
            {unlocked ? "Prova liberada para revisar interpretacao, contexto e aplicacao." : `Conclua ${end - start + 1 - completedInRange} capitulo(s) deste bloco para liberar.`}
          </p>
        </div>
        <button onClick={completeExam} disabled={!unlocked || done} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/64 transition enabled:hover:border-gold-300/25 enabled:hover:text-gold-100 disabled:opacity-45">
          <GraduationCap size={17} />
          {done ? "Prova feita" : "Finalizar prova"}
        </button>
      </div>
      {unlocked && (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {buildExamQuestions(book, start, end).map((question) => (
            <div key={question} className="rounded-2xl border border-white/8 bg-black/10 p-4 text-sm leading-6 text-white/56">{question}</div>
          ))}
        </div>
      )}
    </section>
  );
}

function NotesPanel({
  book,
  chapter,
  note,
  setNote,
  progress
}: {
  book: BibleBook;
  chapter: number;
  note: string;
  setNote: (note: string) => void;
  progress: UserProgress;
}) {
  const favorite = getKeyVerse(book, chapter);
  return (
    <div className="mx-auto max-w-3xl lg:max-w-none">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/42">Painel pessoal</p>
          <h2 className="text-xl font-semibold">Anotacoes</h2>
        </div>
        <PenLine size={18} className="text-gold-300/70" />
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="min-h-72 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.035] p-4 leading-7 text-white/72 outline-none transition placeholder:text-white/28 focus:border-gold-300/35"
        placeholder="Escreva pensamentos, perguntas, insights e aplicacoes..."
      />
      <p className="mt-2 text-xs text-white/34">Salvo automaticamente.</p>

      <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-sm font-medium text-white/72">Versiculo marcado</p>
        <p className="mt-2 text-sm leading-6 text-white/48">{favorite}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-sm font-medium text-white/72">Favoritos</p>
        <div className="mt-3 space-y-2">
          {progress.favoriteVerses.slice(0, 4).map((item) => (
            <p key={item} className="rounded-xl bg-white/[0.035] px-3 py-2 text-sm text-white/48">{item}</p>
          ))}
          {progress.favoriteVerses.length === 0 && <p className="text-sm text-white/34">Nenhum favorito ainda.</p>}
        </div>
      </div>
    </div>
  );
}

function QuizModal({
  open,
  onClose,
  book,
  chapter,
  setProgress
}: {
  open: boolean;
  onClose: () => void;
  book: BibleBook;
  chapter: number;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const question = useMemo(() => buildQuiz(book, chapter), [book, chapter]);
  const isCorrect = selected === question.answer;

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  function answer(option: string) {
    if (selected) return;
    setSelected(option);
    setProgress((current) => addXp({
      ...current,
      quizzesDone: current.quizzesDone + 1,
      quizScores: { ...current.quizScores, [`${book.id}:${chapter}:${Date.now()}`]: option === question.answer ? 100 : 40 },
      recentActivity: [`Quiz de ${book.name} ${chapter}`, ...current.recentActivity].slice(0, 6)
    }, option === question.answer ? 45 : 15));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/62 px-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 14 }} className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#101012] p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold-300/70">Quiz rapido</p>
                <h2 className="mt-2 text-2xl font-semibold">{book.name} {chapter}</h2>
              </div>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/48 transition hover:text-white">
                <X size={17} />
              </button>
            </div>

            <p className="mt-5 text-lg leading-8">{question.prompt}</p>
            <div className="mt-5 space-y-3">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => answer(option)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected && option === question.answer
                      ? "border-emerald-300/45 bg-emerald-300/10"
                      : selected === option
                        ? "border-red-300/45 bg-red-300/10"
                        : "border-white/10 bg-white/[0.035] hover:border-gold-300/25"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {selected && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="font-semibold">{isCorrect ? "Resposta correta" : "Quase. Vamos ajustar a leitura."}</p>
                <p className="mt-2 leading-7 text-white/58">{question.explanation}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BibleStudyCenter({
  progress,
  setProgress
}: {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}) {
  const [question, setQuestion] = useState("O que significa Atos 1:8?");
  const answer = buildStudyAnswer(question);

  function saveAsNote() {
    const key = `study-question:${Date.now()}`;
    setProgress((current) => ({
      ...current,
      notes: { ...current.notes, [key]: `${question}\n\n${answer.summary}` },
      recentActivity: ["Estudou uma pergunta biblica", ...current.recentActivity].slice(0, 6)
    }));
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-6xl px-5 py-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.24em] text-gold-300/80">Estudo Biblico</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Central de perguntas e explicacoes.</h1>
        <p className="mt-3 max-w-2xl leading-7 text-white/52">Pesquise duvidas, versiculos, temas e contexto. As respostas sao organizadas como material de estudo.</p>
        <label className="mt-7 flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-[#0f0f11] px-4">
          <Search size={18} className="text-white/38" />
          <input value={question} onChange={(event) => setQuestion(event.target.value)} className="h-14 flex-1 bg-transparent outline-none" placeholder="Ex: O que significa Atos 1:8?" />
        </label>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-white/10 bg-[#101012]/72 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold">{answer.title}</h2>
          <p className="mt-4 leading-8 text-white/66">{answer.summary}</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoBlock title="Contexto" text={answer.context} />
            <InfoBlock title="Significado" text={answer.meaning} />
            <InfoBlock title="Aplicacao" text={answer.application} />
            <InfoBlock title="Conexoes biblicas" text={answer.connections} />
          </div>
        </div>
        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-soft">
          <h3 className="font-semibold">Salvar estudo</h3>
          <p className="mt-2 text-sm leading-6 text-white/44">Guarde esta resposta como anotacao pessoal para revisar depois.</p>
          <button onClick={saveAsNote} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-halo px-4 font-semibold text-ink">
            <Bookmark size={16} />
            Salvar nas notas
          </button>
          <div className="mt-6 border-t border-white/8 pt-5">
            <p className="text-sm text-white/44">Notas salvas</p>
            <p className="mt-2 text-3xl font-semibold">{Object.keys(progress.notes).length}</p>
          </div>
        </aside>
      </section>
    </motion.div>
  );
}

function SermonsStudio({
  progress,
  setProgress
}: {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}) {
  const [activeId, setActiveId] = useState(progress.sermons[0]?.id ?? "new");
  const active = progress.sermons.find((sermon) => sermon.id === activeId) ?? createEmptySermon();

  function upsertSermon(patch: Partial<SermonDraft>) {
    const next = { ...active, ...patch, updatedAt: new Date().toISOString() };
    setActiveId(next.id);
    setProgress((current) => {
      const exists = current.sermons.some((sermon) => sermon.id === next.id);
      return {
        ...current,
        sermons: exists ? current.sermons.map((sermon) => (sermon.id === next.id ? next : sermon)) : [next, ...current.sermons],
        recentActivity: ["Editou uma pregacao", ...current.recentActivity].slice(0, 6)
      };
    });
  }

  function newSermon() {
    const sermon = createEmptySermon();
    setActiveId(sermon.id);
    setProgress((current) => ({ ...current, sermons: [sermon, ...current.sermons] }));
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto grid max-w-[1400px] gap-5 px-5 py-8 lg:grid-cols-[340px_1fr]">
      <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold-300/70">Pregacoes</p>
            <h1 className="mt-1 text-2xl font-semibold">Esbocos</h1>
          </div>
          <button onClick={newSermon} className="grid h-10 w-10 place-items-center rounded-full bg-halo text-ink">
            <Plus size={18} />
          </button>
        </div>
        <div className="mt-5 space-y-2">
          {progress.sermons.map((sermon) => (
            <button key={sermon.id} onClick={() => setActiveId(sermon.id)} className={`w-full rounded-2xl border p-4 text-left transition ${activeId === sermon.id ? "border-gold-300/28 bg-gold-300/[0.08]" : "border-white/8 bg-white/[0.025] hover:bg-white/[0.05]"}`}>
              <p className="font-semibold">{sermon.title || "Sem titulo"}</p>
              <p className="mt-1 text-sm text-white/42">{sermon.theme || "Tema nao definido"}</p>
            </button>
          ))}
          {progress.sermons.length === 0 && <p className="rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-sm leading-6 text-white/42">Crie seu primeiro esboco para salvar mensagens, temas e aplicacoes.</p>}
        </div>
      </aside>

      <section className="rounded-3xl border border-white/10 bg-[#101012]/72 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.24em] text-gold-300/80">Editor estilo Notion</p>
        <input value={active.title} onChange={(event) => upsertSermon({ title: event.target.value })} className="mt-3 w-full bg-transparent text-4xl font-semibold outline-none placeholder:text-white/24" placeholder="Titulo da pregacao" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SermonField label="Tema" value={active.theme} onChange={(value) => upsertSermon({ theme: value })} />
          <SermonField label="Versiculo-base" value={active.verse} onChange={(value) => upsertSermon({ verse: value })} />
        </div>
        <SermonArea label="Introducao" value={active.intro} onChange={(value) => upsertSermon({ intro: value })} />
        <SermonArea label="Topicos" value={active.topics} onChange={(value) => upsertSermon({ topics: value })} />
        <SermonArea label="Conclusao" value={active.conclusion} onChange={(value) => upsertSermon({ conclusion: value })} />
        <SermonArea label="Aplicacao" value={active.application} onChange={(value) => upsertSermon({ application: value })} />
        <p className="mt-4 text-xs text-white/34">Salvo automaticamente no seu usuario.</p>
      </section>
    </motion.div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <p className="text-sm text-gold-300/70">{title}</p>
      <p className="mt-2 leading-7 text-white/58">{text}</p>
    </div>
  );
}

function SermonField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-white/42">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 outline-none focus:border-gold-300/35" />
    </label>
  );
}

function SermonArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-5 block">
      <span className="text-sm text-white/42">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.035] p-4 leading-7 outline-none focus:border-gold-300/35" />
    </label>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-soft">
      <p className="text-sm text-white/44">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-white/38">{detail}</p>
    </div>
  );
}

function getChapterCount(book: BibleBook) {
  return chapterCounts[book.name] ?? 1;
}

function getTotalChapters() {
  return (books as BibleBook[]).reduce((sum, book) => sum + getChapterCount(book), 0);
}

function getCompletedChapterCount(progress: UserProgress) {
  return Object.values(progress.completedChapters).reduce((sum, chapters) => sum + chapters.length, 0);
}

function getKeyVerse(book: BibleBook, chapter: number) {
  const verse = book.keyVerses?.[(chapter - 1) % book.keyVerses.length] ?? `${book.name} ${chapter}`;
  return `${verse} - leia no contexto de ${book.name} ${chapter}.`;
}

function buildChapterIntro(book: BibleBook, chapter: number) {
  return `${book.name} ${chapter} deve ser lido dentro do tema do livro: ${book.theme}`;
}

function buildSummary(book: BibleBook, chapter: number) {
  const template = book.chapters?.[(chapter - 1) % book.chapters.length] ?? book.purpose;
  return `${template} Neste capitulo, observe a progressao do argumento, a resposta humana e o que o texto revela sobre Deus.`;
}

function buildExplanation(book: BibleBook, chapter: number) {
  const context = book.historicalContext?.[chapter % book.historicalContext.length] ?? book.purpose;
  const character = book.characters?.[chapter % book.characters.length] ?? "o povo de Deus";
  return `${context} Leia o capitulo observando ${character}, os acontecimentos principais e a tensao espiritual do texto. A explicacao central deve unir contexto historico, significado original, teologia e uma aplicacao obediente para hoje.`;
}

function buildQuiz(book: BibleBook, chapter: number) {
  const answer = book.theme;
  return {
    prompt: `Qual ideia melhor resume a leitura de ${book.name} ${chapter}?`,
    answer,
    options: [
      answer,
      "Um texto isolado que pode ser aplicado sem observar contexto.",
      "Uma narrativa sem conexao com a historia redentiva.",
      "Um detalhe historico sem implicacao espiritual."
    ],
    explanation: `A leitura correta considera o tema do livro, seu contexto e sua contribuicao para a historia biblica. Em ${book.name}, o tema central ajuda a interpretar o capitulo sem forcar aplicacoes soltas.`
  };
}

function canTakeExam(progress: UserProgress, book: BibleBook, chapter: number) {
  const start = Math.floor((chapter - 1) / 5) * 5 + 1;
  const end = Math.min(start + 4, getChapterCount(book));
  const completedInRange = (progress.completedChapters[book.id] ?? []).filter((item) => item >= start && item <= end).length;
  return completedInRange === end - start + 1;
}

function buildExamQuestions(book: BibleBook, start: number, end: number) {
  return [
    `Explique o tema principal de ${book.name} ${start}-${end} em uma frase.`,
    `Qual contexto historico mais ajuda a interpretar este bloco?`,
    `Como este trecho aponta para Cristo ou para a historia da redencao?`
  ];
}

function buildStudyAnswer(question: string) {
  const normalized = question.toLowerCase();
  const isActs = normalized.includes("atos") || normalized.includes("1:8");

  if (isActs) {
    return {
      title: "Atos 1:8 — poder, testemunho e missao",
      summary: "Atos 1:8 mostra que a missao da igreja nasce do poder do Espirito Santo. O texto nao e apenas sobre estrategia evangelistica, mas sobre dependencia espiritual e testemunho centrado em Cristo.",
      context: "Jesus fala aos discipulos depois da ressurreicao e antes da ascensao. Eles esperavam a restauracao imediata do reino, mas Jesus direciona a atencao para a missao.",
      meaning: "O poder prometido nao e dominio politico; e capacitacao espiritual para testemunhar com fidelidade em Jerusalem, Judeia, Samaria e ate os confins da terra.",
      application: "A igreja hoje precisa trocar ansiedade por fidelidade: receber direcao de Cristo, depender do Espirito e testemunhar onde Deus a colocou.",
      connections: "Conecta-se com Lucas 24:49, Mateus 28:18-20 e com o movimento inteiro de Atos, que mostra o evangelho avancando por meio do Espirito."
    };
  }

  return {
    title: "Estudo guiado",
    summary: "Para responder bem, observe o contexto imediato, o genero literario, o publico original e a ligacao do texto com Cristo e com a historia biblica.",
    context: "Pergunte: quem escreveu, para quem, em que situacao e qual problema o texto responde?",
    meaning: "Procure a ideia central antes de aplicar. Um versiculo raramente deve ser interpretado isolado do argumento do capitulo.",
    application: "A aplicacao fiel nasce do significado correto: o texto deve formar adoracao, obediencia, arrependimento e esperanca.",
    connections: "Compare com outros textos biblicos, mas sem forcar conexoes. A melhor conexao e aquela que respeita o contexto dos dois textos."
  };
}

function createEmptySermon(): SermonDraft {
  return {
    id: `sermon-${Date.now()}`,
    title: "",
    theme: "",
    verse: "",
    intro: "",
    topics: "",
    conclusion: "",
    application: "",
    updatedAt: new Date().toISOString()
  };
}
