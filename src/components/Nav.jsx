import { BookOpen, Brain, Flame, Home, LayoutDashboard, Sparkles } from "lucide-react";
import { ShareButton } from "./ShareButton";

const links = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "estudo", label: "Estudo", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: Brain },
  { id: "devocional", label: "Devocional", icon: Flame },
  { id: "ia", label: "IA", icon: Sparkles }
];

export function Nav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-ink/58 px-4 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-300/40 bg-gold-300/10 text-gold-100">
            <BookOpen size={18} />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-halo">Lumen</span>
        </a>
        <nav className="hide-scrollbar flex max-w-[70vw] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-sm text-white/62 transition hover:bg-white/10 hover:text-halo"
              title={link.label}
            >
              <link.icon size={15} />
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}
        </nav>
        <ShareButton />
      </div>
    </header>
  );
}
