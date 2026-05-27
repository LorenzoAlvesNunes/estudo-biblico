/**
 * Bible API Configuration
 *
 * Supported providers:
 * 1. API.Bible (paid) - has NVI, ARA, and 1000+ versions
 *    Get free API key at https://api.scripture.api.bible
 *
 * 2. bible-api.com (free) - has Almeida, English versions
 *    No API key needed
 */

export type BibleProvider = "api-bible" | "bible-api";

export interface BibleTranslation {
  id: string;
  label: string;
  provider: BibleProvider;
  apiId?: string; // For API.Bible: version ID like "pt-ARA2009"
}

// Mapping between UI IDs and API.Bible version IDs
const API_BIBLE_VERSIONS: Record<string, string> = {
  "nvi": "pt-NVI",           // New International Version (Portuguese)
  "ara": "pt-ARA2009",       // Almeida Revista e Atualizada 2009
  "almeida": "pt-ARC1995",   // Almeida Revista e Corrigida 1995
};

// Mapping for bible-api.com (uses same ID as provider)
const BIBLE_API_VERSIONS = [
  "almeida",
  "kjv",
  "web",
  "asv",
  "clementine"
];

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  // Portuguese versions
  { id: "nvi", label: "NVI (PT)", provider: "api-bible", apiId: "pt-NVI" },
  { id: "ara", label: "ARA (PT)", provider: "api-bible", apiId: "pt-ARA2009" },
  { id: "almeida", label: "Almeida (PT)", provider: "bible-api" },

  // English versions
  { id: "kjv", label: "King James (EN)", provider: "bible-api" },
  { id: "web", label: "World English (EN)", provider: "bible-api" },
  { id: "asv", label: "Std. 1901 (EN)", provider: "bible-api" },

  // Latin
  { id: "clementine", label: "Vulgata (LA)", provider: "bible-api" },
];

export function getApiBibleVersionId(translationId: string): string | null {
  return API_BIBLE_VERSIONS[translationId] || null;
}

export function isApiBibleVersion(translationId: string): boolean {
  return translationId in API_BIBLE_VERSIONS;
}

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  const key = localStorage.getItem("lumen-api-bible-key");
  return key || null;
}

export function setApiKey(key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("lumen-api-bible-key", key);
  }
}

export function clearApiKey() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("lumen-api-bible-key");
  }
}
