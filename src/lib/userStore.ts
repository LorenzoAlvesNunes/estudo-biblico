import { supabase } from "./supabaseClient";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  provider: "demo" | "supabase";
};

export type UserProgress = {
  xp: number;
  level: number;
  streak: number;
  studiedMinutes: number;
  quizzesDone: number;
  examsDone: number;
  completedBooks: string[];
  completedChapters: Record<string, number[]>;
  completedExams: string[];
  favorites: string[];
  favoriteVerses: string[];
  notes: Record<string, string>;
  notebooks: Record<string, string[]>;
  sermons: Array<{
    id: string;
    title: string;
    theme: string;
    verse: string;
    intro: string;
    topics: string;
    conclusion: string;
    application: string;
    updatedAt: string;
  }>;
  devotionalHistory: string[];
  recentActivity: string[];
  quizScores: Record<string, number>;
};

export const emptyProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  studiedMinutes: 0,
  quizzesDone: 0,
  examsDone: 0,
  completedBooks: [],
  completedChapters: {},
  completedExams: [],
  favorites: [],
  favoriteVerses: [],
  notes: {},
  notebooks: {},
  sermons: [],
  devotionalHistory: [],
  recentActivity: [],
  quizScores: {}
};

const DEMO_EMAIL = "Lorenzoalzeny.com";
const DEMO_PASSWORD = "Bela1980@";
const SESSION_KEY = "lumen-session";

function progressKey(userId: string) {
  return `lumen-progress:${userId}`;
}

export function getStoredSession(): AppUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function storeSession(user: AppUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loadProgress(userId: string): UserProgress {
  const raw = localStorage.getItem(progressKey(userId));
  if (!raw) return emptyProgress;

  try {
    return { ...emptyProgress, ...JSON.parse(raw) };
  } catch {
    return emptyProgress;
  }
}

export async function loadUserProgress(user: AppUser): Promise<UserProgress> {
  const localProgress = loadProgress(user.id);

  if (!supabase || user.provider !== "supabase") return localProgress;

  const { data, error } = await supabase
    .from("study_progress")
    .select("payload")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return localProgress;

  if (data?.payload) {
    const remoteProgress = { ...emptyProgress, ...(data.payload as Partial<UserProgress>) };
    localStorage.setItem(progressKey(user.id), JSON.stringify(remoteProgress));
    return remoteProgress;
  }

  await persistProgress(user, localProgress);
  return localProgress;
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}::lumen-scriptura`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function persistProgress(user: AppUser, progress: UserProgress) {
  localStorage.setItem(progressKey(user.id), JSON.stringify(progress));

  if (!supabase || user.provider !== "supabase") return;

  const { error } = await supabase.from("study_progress").upsert({
    user_id: user.id,
    payload: progress,
    updated_at: new Date().toISOString()
  });

  if (!error) await persistDerivedTables(user, progress);
}

async function persistDerivedTables(user: AppUser, progress: UserProgress) {
  if (!supabase || user.provider !== "supabase") return;

  const completedRows = Object.entries(progress.completedChapters).flatMap(([bookId, chapters]) =>
    chapters.map((chapter) => ({
      user_id: user.id,
      book_id: bookId,
      chapter
    }))
  );

  const noteRows = Object.entries(progress.notes).map(([key, content]) => {
    const [bookId, chapter] = key.split(":");
    return {
      user_id: user.id,
      note_key: key,
      book_id: bookId ?? "general",
      chapter: Number(chapter) || null,
      content,
      updated_at: new Date().toISOString()
    };
  });

  const favoriteRows = progress.favoriteVerses.map((verseRef) => ({
    user_id: user.id,
    verse_ref: verseRef
  }));

  const sermonRows = progress.sermons.map((sermon) => ({
    id: sermon.id,
    user_id: user.id,
    title: sermon.title,
    theme: sermon.theme,
    verse: sermon.verse,
    intro: sermon.intro,
    topics: sermon.topics,
    conclusion: sermon.conclusion,
    application: sermon.application,
    updated_at: sermon.updatedAt
  }));

  await Promise.all([
    completedRows.length
      ? supabase.from("completed_chapters").upsert(completedRows, { onConflict: "user_id,book_id,chapter" })
      : Promise.resolve(),
    noteRows.length
      ? supabase.from("study_notes").upsert(noteRows, { onConflict: "user_id,note_key" })
      : Promise.resolve(),
    favoriteRows.length
      ? supabase.from("favorites").upsert(favoriteRows, { onConflict: "user_id,verse_ref" })
      : Promise.resolve(),
    sermonRows.length
      ? supabase.from("sermons").upsert(sermonRows, { onConflict: "id" })
      : Promise.resolve()
  ]);
}

export async function login(email: string, password: string): Promise<AppUser> {
  const normalizedEmail = email.toLowerCase().trim();

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const user = { id: "demo-lorenzo-zero-state", email, name: "Lorenzo", provider: "demo" as const };
    storeSession(user);
    return user;
  }

  if (!supabase) {
    throw new Error("Supabase nao esta configurado. Use o usuario demo ou configure as variaveis de ambiente.");
  }

  const hash = await hashPassword(password);
  const { data, error } = await supabase
    .from("app_users")
    .select("id, email, name, password_hash")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("Erro no login:", error);
    throw new Error(`Não foi possível entrar: ${error.message}`);
  }
  if (!data || data.password_hash !== hash) throw new Error("E-mail ou senha incorretos.");

  const user = { id: data.id as string, email: data.email as string, name: data.name as string, provider: "supabase" as const };
  storeSession(user);
  return user;
}

export async function register(name: string, email: string, password: string): Promise<AppUser> {
  const normalizedEmail = email.toLowerCase().trim();

  if (!supabase) {
    const user = { id: `local-${normalizedEmail}`, email: normalizedEmail, name, provider: "demo" as const };
    storeSession(user);
    return user;
  }

  const { data: existing } = await supabase.from("app_users").select("id").eq("email", normalizedEmail).maybeSingle();
  if (existing) throw new Error("Já existe uma conta com esse e-mail. Tente entrar.");

  const hash = await hashPassword(password);
  const { data, error } = await supabase
    .from("app_users")
    .insert({ email: normalizedEmail, name, password_hash: hash })
    .select("id, email, name")
    .single();

  if (error || !data) {
    console.error("Erro no cadastro:", error);
    const motivo = error?.message ? `: ${error.message}` : "";
    throw new Error(`Não foi possível cadastrar${motivo}. Verifique se o banco de dados está configurado.`);
  }

  const user = { id: data.id as string, email: data.email as string, name: data.name as string, provider: "supabase" as const };
  storeSession(user);
  await persistProgress(user, emptyProgress);
  return user;
}

export async function recoverPassword(_email: string) {
  // Recuperacao de senha por e-mail sera adicionada futuramente.
  return;
}

export async function logout() {
  clearSession();
}
