// Saves lesson progress in the browser (localStorage), so it survives page reloads.
// Shape: { "1": 10, "2": 4 }  →  lesson 1 has all 10 levels done, lesson 2 has 4.

export const MAX_LEVEL = 10;

const STORAGE_KEY = "vocab_progress_v1";

export type Progress = Record<string, number>;

export function loadProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Progress) : {};
  } catch {
    return {};
  }
}

/** Saves the number of completed levels for a lesson. It never goes backwards. */
export function saveLevel(lessonId: string, level: number) {
  if (typeof window === "undefined") return;
  try {
    const progress = loadProgress();
    const next = Math.min(MAX_LEVEL, Math.max(progress[lessonId] ?? 0, level));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, [lessonId]: next }));
  } catch {
    // Storage can be blocked (private mode); progress just won't be saved.
  }
}