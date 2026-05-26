import { Award, Bookmark, Clock, Flame, Percent, Trophy } from "lucide-react";
import { Section } from "../components/Section";
import { StatCard } from "../components/StatCard";
import { metrics } from "../data/bible";

const icons = [Percent, Flame, Trophy, Award, Clock, Bookmark];

export function Dashboard({ percent, syncSource }) {
  return (
    <Section id="dashboard" eyebrow="Dashboard" title="Seu progresso espiritual em uma visao clara.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <StatCard key={metric.label} {...metric} icon={icons[index]} />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
        <div className="glass rounded-lg p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-halo">Mapa de conclusao</h3>
            <span className="text-sm text-white/54">Sync: {syncSource}</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-300 to-halo" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-12">
            {Array.from({ length: 66 }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-[4px] border ${index < 27 ? "border-gold-300/40 bg-gold-300/35" : "border-white/10 bg-white/5"}`}
              />
            ))}
          </div>
        </div>
        <div className="glass rounded-lg p-6">
          <h3 className="text-xl font-semibold text-halo">Gamificacao</h3>
          <p className="mt-2 text-sm leading-6 text-white/58">Pontos, streak, favoritos, historico e notas pessoais ficam salvos localmente e podem sincronizar com Supabase.</p>
          <div className="mt-6 rounded-lg border border-gold-300/25 bg-gold-300/10 p-5">
            <div className="text-sm text-gold-100">Nivel atual</div>
            <div className="mt-2 text-4xl font-semibold text-halo">Ouro II</div>
          </div>
        </div>
      </div>
    </Section>
  );
}
