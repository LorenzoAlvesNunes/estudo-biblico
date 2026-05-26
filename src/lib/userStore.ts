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
  completedBooks: string[];
  completedChapters: Record<string, number[]>;
  favorites: string[];
  favoriteVerses: string[];
  notes: Record<string, string>;
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
  completedBooks: [],
  completedChapters: {},
  favorites: [],
  favoriteVerses: [],
  notes: {},
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

export async function persistProgress(user: AppUser, progress: UserProgress) {
  localStorage.setItem(progressKey(user.id), JSON.stringify(progress));

  if (!supabase || user.provider !== "supabase") return;

  await supabase.from("progress").upsert({
    user_id: user.id,
    payload: progress,
    updated_at: new Date().toISOString()
  });
}

export async function login(email: string, password: string): Promise<AppUser> {
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const user = { id: "demo-lorenzo-zero-state", email, name: "Lorenzo", provider: "demo" as const };
    storeSession(user);
    return user;
  }

  if (!supabase) {
    throw new Error("Supabase nao esta configurado. Use o usuario demo ou configure as variaveis de ambiente.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user?.email) throw new Error(error?.message ?? "Nao foi possivel entrar.");

  const user = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name ?? data.user.email.split("@")[0],
    provider: "supabase" as const
  };
  storeSession(user);
  return user;
}

export async function register(name: string, email: string, password: string): Promise<AppUser> {
  if (!supabase) {
    const user = {
      id: `local-${email.toLowerCase()}`,
      email,
      name,
      provider: "demo" as const
    };
    storeSession(user);
    return user;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error || !data.user?.email) throw new Error(error?.message ?? "Nao foi possivel cadastrar.");

  const user = { id: data.user.id, email: data.user.email, name, provider: "supabase" as const };
  storeSession(user);
  return user;
}

export async function recoverPassword(email: string) {
  if (!supabase) return;
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== "undefined" ? window.location.origin : undefined
  });
}

export async function logout() {
  clearSession();
  if (supabase) await supabase.auth.signOut();
}
