import { useMemo, useState } from "react";
import { loadLocalProgress, saveProgress } from "../lib/supabase";

const initialProgress = {
  userId: "demo-user",
  completed: 486,
  streak: 18,
  points: 2840,
  favorites: ["Jo 3:16", "Rm 8:1"],
  highlights: ["Genesis 12", "João 1"],
  history: ["Genesis", "João", "Romanos"],
  notes: "Observar como promessa e presença caminham juntas."
};

export function useProgress() {
  const [progress, setProgress] = useState(() => loadLocalProgress() ?? initialProgress);
  const [syncSource, setSyncSource] = useState("local");

  async function updateProgress(patch) {
    const next = { ...progress, ...patch, updatedAt: new Date().toISOString() };
    setProgress(next);
    const result = await saveProgress(next);
    setSyncSource(result.source);
  }

  const percent = useMemo(() => Math.round((progress.completed / 1189) * 100), [progress.completed]);

  return { progress, percent, syncSource, updateProgress };
}
