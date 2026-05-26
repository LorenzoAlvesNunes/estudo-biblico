import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Section } from "../components/Section";
import { quizQuestions } from "../data/bible";

export function Quiz({ onScore }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const current = quizQuestions[index];
  const answered = selected !== null;
  const correct = selected === current.answer;
  const progress = ((index + (answered ? 1 : 0)) / quizQuestions.length) * 100;

  function answer(optionIndex) {
    if (answered) return;
    setSelected(optionIndex);
    if (optionIndex === current.answer) {
      setScore((value) => value + 100 + index * 25);
      onScore(100 + index * 25);
    }
  }

  function next() {
    setSelected(null);
    setIndex((value) => (value + 1) % quizQuestions.length);
  }

  return (
    <Section id="quiz" eyebrow="Quiz Interativo" title="Dificuldade progressiva, pontos e correcao animada.">
      <div className="glass mx-auto max-w-4xl rounded-lg p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-gold-300/25 bg-gold-300/10 px-4 py-2 text-sm text-gold-100">{current.level}</span>
          <span className="text-sm text-white/62">Pontos: {score}</span>
        </div>
        <div className="mb-7 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-300 to-halo" animate={{ width: `${progress}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.question}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <h3 className="text-2xl font-semibold text-halo">{current.question}</h3>
            <div className="mt-6 grid gap-3">
              {current.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;
                const isAnswer = current.answer === optionIndex;
                return (
                  <button
                    key={option}
                    onClick={() => answer(optionIndex)}
                    className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${
                      answered && isAnswer
                        ? "border-emerald-300/55 bg-emerald-300/12"
                        : answered && isSelected
                          ? "border-red-300/55 bg-red-300/12"
                          : "border-white/10 bg-white/[0.04] hover:border-gold-300/35"
                    }`}
                  >
                    <span className="text-white/78">{option}</span>
                    {answered && isAnswer && <Check className="text-emerald-300" size={18} />}
                    {answered && isSelected && !isAnswer && <X className="text-red-300" size={18} />}
                  </button>
                );
              })}
            </div>
            {answered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-5 rounded-lg border p-4 ${correct ? "border-emerald-300/30 bg-emerald-300/10" : "border-red-300/30 bg-red-300/10"}`}
              >
                <div className="font-semibold text-halo">{correct ? "Resposta correta" : "Quase la"}</div>
                <p className="mt-1 text-sm text-white/64">A correcao mostra o conceito central e prepara a proxima dificuldade.</p>
              </motion.div>
            )}
            <button
              onClick={next}
              className="mt-6 rounded-full bg-halo px-5 py-3 font-semibold text-ink transition hover:bg-gold-100"
            >
              Proxima pergunta
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
