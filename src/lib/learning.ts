import type { UserProgress } from "./userStore";

export function getBiblePercent(progress: UserProgress, totalBooks: number) {
  return Math.round((progress.completedBooks.length / totalBooks) * 100);
}

export function getLevelName(level: number) {
  if (level >= 20) return "Mestre das Escrituras";
  if (level >= 12) return "Discípulo Avançado";
  if (level >= 7) return "Explorador Bíblico";
  if (level >= 3) return "Aluno Fiel";
  return "Início da Jornada";
}

export function addXp(progress: UserProgress, xp: number): UserProgress {
  const nextXp = progress.xp + xp;
  return {
    ...progress,
    xp: nextXp,
    level: Math.max(1, Math.floor(nextXp / 500) + 1)
  };
}
