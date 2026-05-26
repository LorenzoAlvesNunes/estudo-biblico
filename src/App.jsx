import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "./components/Nav";
import { Particles } from "./components/Particles";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Study } from "./pages/Study";
import { Quiz } from "./pages/Quiz";
import { Devotional } from "./pages/Devotional";
import { AIChat } from "./pages/AIChat";
import { useProgress } from "./hooks/useProgress";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { progress, percent, syncSource, updateProgress } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    gsap.utils.toArray(".section-reveal").forEach((section) => {
      gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%"
        }
      });
    });

    gsap.to("[data-parallax]", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [loading]);

  function addFavorite(value) {
    const favorites = Array.from(new Set([...(progress.favorites ?? []), value]));
    updateProgress({ favorites });
  }

  function addScore(points) {
    updateProgress({ points: progress.points + points });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-halo">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 grid place-items-center bg-ink"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="mx-auto h-16 w-16 rounded-full border border-gold-300/20 border-t-gold-300"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-sm uppercase tracking-[0.32em] text-gold-300"
              >
                Preparando estudo
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Particles />
      <Nav />
      <main className="relative z-10">
        <Home />
        <Dashboard percent={percent} syncSource={syncSource} />
        <Study onFavorite={addFavorite} />
        <Quiz onScore={addScore} />
        <Devotional note={progress.notes} onNote={(notes) => updateProgress({ notes })} />
        <AIChat />
      </main>
      <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-center text-sm text-white/48">
        Lumen Scriptura usa Supabase quando configurado e fallback local para progresso, favoritos, historico e notas.
      </footer>
    </div>
  );
}
