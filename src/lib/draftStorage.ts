export const DRAFT_FORM_KEY = "hotam-draft-material-form";
export const DRAFT_PLENARY_KEY = "hotam-draft-plenary";

export function readDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeDraft(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota, etc.) — draft backup is best-effort
  }
}

export function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function clearAllDrafts() {
  clearDraft(DRAFT_FORM_KEY);
  clearDraft(DRAFT_PLENARY_KEY);
}
