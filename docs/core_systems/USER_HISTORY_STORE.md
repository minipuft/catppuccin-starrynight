# 📚 User Genre History Store

## Overview

`UserGenreHistory` is a **tiny persistence helper** that remembers which music genres a listener has already encountered.
Its single purpose is to prevent _Nebula discovery cues_ (and future onboarding hints) from repeating once the user has seen a genre.

- **File:** `src-js/store/UserHistory.ts`
- **Storage:** `localStorage` (key `sn_seen_genres_v1`)
- **Dependencies:** None – safe for degraded / offline builds.

---

## 1 ▪ Public API

| Method            | Signature                    | Purpose                                                             |
| ----------------- | ---------------------------- | ------------------------------------------------------------------- |
| `hasSeen(genre)`  | `(genre: string) => boolean` | Returns **true** if the genre (case-insensitive) has been recorded. |
| `markSeen(genre)` | `(genre: string) => void`    | Adds the genre to the `seen` set and persists.                      |

> The constructor automatically loads the persisted set and can be instantiated anywhere:
>
> ```ts
> const history = new UserGenreHistory();
> if (!history.hasSeen("drill")) {
>   cueNebulaDiscovery();
>   history.markSeen("drill");
> }
> ```

---

## 2 ▪ Persistence Details

- Data is serialised to JSON array of lower-cased genre strings.
- Write-through on every `markSeen` call (fail-safe on quota errors).
- Versioning via the key suffix (`_v1`). Increment on breaking schema changes.

---

## 3 ▪ Integration Scenarios

| Consumer                       | Trigger                                                            | Example                                                     |
| ------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| **NebulaController**           | Show discovery halo only the first time the user plays a genre.    | `if (!history.hasSeen(g)) { halo(); history.markSeen(g); }` |
| **Recommendations Panel**      | Offer "New to you" badge for unseen genres.                        | Same pattern.                                               |
| **EmergentChoreographyEngine** | Future phase – feed genre familiarity into signature adaptability. | _Planned (Phase 4)_.                                        |

---

## 4 ▪ Best Practices

1. **Batch checks**: If you need to test many genres in a loop, cache the set `history.getAll()` _(todo for v2)_ instead of repeated calls.
2. **Avoid direct `localStorage` access** outside this class; keeps format centralised.
3. **Don't abuse** it for large data – stick to short genre slugs.

---

## 5 ▪ Roadmap

| Version | Item                                                         |
| ------- | ------------------------------------------------------------ |
| v1.1    | Add `reset()` helper for debug overlay.                      |
| v2.0    | Switch to `TemporalMemoryService` to unify user persistence. |

---

## 6 ▪ Status

- **Stable – v1.0** (introduced Feb 2025)
- API unlikely to change until persistence layer migration.

---

_"Memory is cheap; delight is priceless."_
