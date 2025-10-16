// ============================================================================
// 🎶 USER HISTORY STORE – Tracks which music genres have been seen by user
// ============================================================================
// Lightweight store backed by localStorage to remember whether the Nebula
// discovery cue should trigger for a given genre.
// No external dependencies; safe for degraded builds.
// ============================================================================

import { GenreType } from "@/types/genre";

const LS_KEY = "sn_seen_genres_v1";

export class UserGenreHistory {
  private seen: Set<string>;

  constructor() {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    this.seen = new Set<string>(raw ? JSON.parse(raw) : []);
  }

  public hasSeen(genre: GenreType): boolean {
    return this.seen.has(genre.toLowerCase());
  }

  public markSeen(genre: GenreType): void {
    const key = genre.toLowerCase();
    if (!this.seen.has(key)) {
      this.seen.add(key);
      this._persist();
    }
  }

  private _persist(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LS_KEY, JSON.stringify([...this.seen]));
      }
    } catch (_e) {
      /* ignore quota issues */
    }
  }
}
