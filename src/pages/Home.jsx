import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";

export function Home() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden px-5 pt-28 sm:px-8 lg:px-10">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/cinematic-bible-hero.png"
          alt=""
          data-parallax
          className="h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/82 to-ink/26" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
        <div className="soft-grid absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 pb-12 lg:grid-cols-[1.05fr_.95fr]">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-300/30 bg-white/8 px-4 py-2 text-sm text-gold-100 backdrop-blur-xl"
          >
            <ShieldCheck size={16} />
            Plataforma premium de estudo biblico
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="max-w-4xl text-5xl font-semibold leading-[1.02] text-halo sm:text-6xl lg:text-7xl"
          >
            Lumen <span className="gold-text">Scriptura</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.8 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-white/72"
          >
            Estudos profundos, devocionais, quizzes progressivos, notas pessoais e IA biblica em uma experiencia cinematografica.
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: 0.55, duration: 1.1, ease: "easeOut" }}
            className="mt-8 border-l border-gold-300/70 pl-5 text-xl text-halo"
          >
            "A tua palavra e lampada para os meus pes e luz para o meu caminho."
          </motion.blockquote>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-halo px-6 py-3 font-semibold text-ink transition hover:bg-gold-100"
            >
              Começar Estudo
              <ArrowRight className="transition group-hover:translate-x-1" size={18} />
            </a>
            <a
              href="#estudo"
              className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3 font-semibold text-halo backdrop-blur-xl transition hover:border-gold-300/50"
            >
              <Play size={18} />
              Ver Jornada
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="glass hidden rounded-lg p-5 lg:block"
        >
          <div className="rounded-lg border border-white/10 bg-ink/58 p-5">
            <div className="mb-6 h-1 w-full rounded-full bg-white/10">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-gold-700 via-gold-300 to-halo" />
            </div>
            {["Genesis: alianca e promessa", "Joao: sinais e vida", "Romanos: graca e justica"].map((item, index) => (
              <div key={item} className="mb-3 flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.04] p-4">
                <span className="text-white/78">{item}</span>
                <span className="text-sm text-gold-300">{index === 0 ? "72%" : index === 1 ? "48%" : "34%"}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
