import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: true } }) : null;

const STORAGE_KEY = "lumen-scriptura-progress";

export function loadLocalProgress() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveLocalProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function saveProgress(progress) {
  saveLocalProgress(progress);

  if (!supabase) return { source: "local" };

  const { error } = await supabase.from("study_progress").upsert({
    id: progress.userId,
    payload: progress,
    updated_at: new Date().toISOString()
  });

  if (error) return { source: "local", error };
  return { source: "supabase" };
}
