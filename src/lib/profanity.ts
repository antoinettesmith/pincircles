/**
 * Basic profanity filter middleware
 * Filters common profanity from user-generated content
 */
const PROFANITY_LIST = [
  "damn",
  "hell",
  "crap",
  "ass",
  "bastard",
  "bitch",
  "dick",
  "fuck",
  "shit",
  "piss",
  "slut",
  "whore",
  "retard",
  "fag",
  "nigger",
  "nigga",
];

/**
 * Replace profanity with asterisks
 */
export function filterProfanity(text: string): string {
  if (!text || typeof text !== "string") return text;

  let filtered = text;
  const regex = new RegExp(
    PROFANITY_LIST.map((w) => `\\b${w}\\b`).join("|"),
    "gi"
  );

  filtered = filtered.replace(regex, (match) => "*".repeat(match.length));
  return filtered;
}

/**
 * Check if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const filtered = filterProfanity(text);
  return filtered !== text;
}
