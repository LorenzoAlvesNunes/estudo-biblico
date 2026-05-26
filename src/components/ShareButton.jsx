import { useState } from "react";
import { Check, Share2 } from "lucide-react";

const shareData = {
  title: "Lumen Scriptura",
  text: "Estude a Biblia inteira com estudos profundos, quiz, devocional e IA biblica."
};

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function shareSite() {
    const url = window.location.origin + window.location.pathname;

    if (navigator.share) {
      await navigator.share({ ...shareData, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={shareSite}
      className="hidden h-9 shrink-0 items-center gap-2 rounded-full border border-gold-300/30 bg-gold-300/10 px-3 text-sm font-medium text-gold-100 transition hover:bg-gold-300/18 md:flex"
      title="Compartilhar site"
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? "Copiado" : "Compartilhar"}
    </button>
  );
}
