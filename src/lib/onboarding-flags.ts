const SEEN_INTRO_KEY = "agricon_seen_intro";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SEEN_INTRO_KEY) === "1";
}

export function markIntroSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEEN_INTRO_KEY, "1");
}
