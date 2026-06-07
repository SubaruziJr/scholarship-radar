import { EssaySuggestion, Scholarship } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Essay reuse matcher
//
// The student pastes an essay (or just a topic). We extract its meaningful
// keywords and compare them against each scholarship's essay prompt + themes.
// No external API — this is a transparent keyword/theme overlap model that you
// can later swap for an embeddings-based similarity call.
// ─────────────────────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "for",
  "with", "as", "by", "at", "from", "is", "are", "was", "were", "be", "been",
  "being", "this", "that", "these", "those", "it", "its", "i", "me", "my",
  "we", "our", "you", "your", "he", "she", "they", "them", "his", "her",
  "their", "what", "which", "who", "whom", "how", "when", "where", "why",
  "can", "could", "would", "should", "will", "shall", "may", "might", "must",
  "do", "does", "did", "have", "has", "had", "not", "no", "so", "than", "then",
  "there", "here", "about", "into", "over", "after", "before", "up", "down",
  "out", "off", "all", "any", "some", "more", "most", "other", "such", "own",
  "too", "very", "just", "also", "because", "while", "during", "through",
  "us", "am", "get", "got", "make", "made", "like", "one", "two", "really",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, "").trim())
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/** crude stemmer: collapse a few common suffixes so "leading" ~ "leader". */
function stem(word: string): string {
  return word
    .replace(/(ing|ed|ness|ment|tion|ities|ity|ies|s)$/i, "")
    .replace(/(er|or)$/i, "");
}

function keywordSet(text: string): Set<string> {
  return new Set(tokenize(text).map(stem).filter((w) => w.length > 2));
}

/**
 * Compare a student's essay against one scholarship.
 * Returns a 0–100 fit score and the themes that overlapped.
 */
function scoreEssayFit(
  essayKeywords: Set<string>,
  scholarship: Scholarship
): { fit: number; matchedThemes: string[] } {
  const themes = scholarship.essayThemes ?? [];
  const promptKeywords = scholarship.essayPrompt
    ? keywordSet(scholarship.essayPrompt)
    : new Set<string>();

  if (themes.length === 0 && promptKeywords.size === 0) {
    return { fit: 0, matchedThemes: [] };
  }

  // Theme overlap (weighted heavily): does the essay touch the prompt's themes?
  const matchedThemes: string[] = [];
  for (const theme of themes) {
    const themeStems = [...keywordSet(theme)];
    const touched = themeStems.some((ts) =>
      [...essayKeywords].some((ek) => ek === ts || ek.includes(ts) || ts.includes(ek))
    );
    if (touched) matchedThemes.push(theme);
  }
  const themeScore = themes.length > 0 ? matchedThemes.length / themes.length : 0;

  // Prompt keyword overlap (lighter weight): vocabulary similarity.
  let promptHits = 0;
  for (const pk of promptKeywords) {
    if ([...essayKeywords].some((ek) => ek === pk || ek.includes(pk) || pk.includes(ek))) {
      promptHits++;
    }
  }
  const promptScore =
    promptKeywords.size > 0 ? promptHits / promptKeywords.size : 0;

  const fit = Math.round((themeScore * 0.75 + promptScore * 0.25) * 100);
  return { fit, matchedThemes };
}

/**
 * Suggest which scholarship essay prompts an existing essay could be reused for.
 * Only scholarships that require an essay are considered. Sorted best-first.
 */
export function suggestEssayReuse(
  essay: string,
  scholarships: Scholarship[]
): EssaySuggestion[] {
  const trimmed = essay.trim();
  if (trimmed.length < 8) return [];

  const essayKeywords = keywordSet(trimmed);
  if (essayKeywords.size === 0) return [];

  return scholarships
    .filter((s) => s.requiresEssay && (s.essayPrompt || (s.essayThemes?.length ?? 0) > 0))
    .map((s) => {
      const { fit, matchedThemes } = scoreEssayFit(essayKeywords, s);
      return { scholarship: s, fit, matchedThemes };
    })
    .filter((r) => r.fit > 0)
    .sort((a, b) => b.fit - a.fit);
}
