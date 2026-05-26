/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        obsidian: "#0a0a0c",
        graphite: "#151519",
        parchment: "#f4ead7",
        halo: "#fff8e5",
        gold: {
          100: "#fff1bf",
          300: "#e6c66a",
          500: "#b98d32",
          700: "#72511a"
        }
      },
      boxShadow: {
        aura: "0 0 70px rgba(230, 198, 106, 0.22)",
        glass: "inset 0 1px 0 rgba(255,255,255,.12), 0 20px 70px rgba(0,0,0,.38)"
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, rgba(230,198,106,0), rgba(230,198,106,.85), rgba(230,198,106,0))"
      }
    }
  },
  plugins: []
};
