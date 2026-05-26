import { motion } from "framer-motion";

export function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`section-reveal relative px-5 py-20 sm:px-8 lg:px-10 ${className}`}>
      <div className="mx-auto w-full max-w-7xl">
        {(eyebrow || title) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">{eyebrow}</p>}
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                className="text-3xl font-semibold text-halo sm:text-4xl lg:text-5xl"
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
