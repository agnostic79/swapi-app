# AGENTS.md — Responsive Login Form with SWAPI Data Table

Context file for continuing this project in a future session. Read this first before making changes.

## Project Summary

React + TypeScript (Vite) app with:
1. A login form with client-side validation, gated against a mock credential store
2. A protected `/table` route showing paginated, cached Star Wars character data
3. Full error/offline/loading/404 handling, styled as a cohesive "archive terminal" UI

**Status: feature-complete.** Every requirement from the original spec is implemented (see checklist at the bottom). Remaining work, if any, is polish/extension — not core functionality.

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- react-router-dom (routing)
- Context API (auth state — no external state library)
- Browser `localStorage` (caching layer, no backend/DB)
- Plain CSS with CSS custom properties (no Tailwind/styled-components/UI library)
- Fonts: `Inter` (body) + `JetBrains Mono` (display/data), loaded via Google Fonts `<link>` in `index.html`

## File Structure

```
src/
├── components/
│   ├── LoginForm.tsx / .css
│   ├── ProtectedRoute.tsx
│   ├── Pagination.tsx / .css
│   ├── ErrorState.tsx / .css
│   ├── OfflineModal.tsx / .css
│   └── LoadingSpinner.tsx / .css
├── context/
│   └── AuthContext.tsx
├── hooks/
│   ├── useDebounce.ts
│   └── useOnlineStatus.ts
├── pages/
│   ├── Login.tsx / .css
│   ├── Table.tsx / .css
│   └── NotFound.tsx / .css
├── services/
│   └── swapi.ts
├── types/
│   └── swapi.ts
├── utils/
│   ├── validation.ts
│   └── cache.ts
├── db.ts
├── App.tsx
└── index.css   (global tokens + reset)
```

## Key Architectural Decisions (and why)

- **Auth is mock-only, in-memory.** `db.ts` hardcodes one valid user (`Martines` / `starwars`). `AuthContext` holds `isAuthenticated` in React state — **no persistence**, so refreshing `/table` logs the user out and redirects to `/`. This was a deliberate scope call, flagged to the user, not revisited. If persistence is wanted later, store `isAuthenticated` in `sessionStorage` and hydrate on mount.
- **Validation is two-layered.** Field-level (4–30 chars, non-empty) controls the **button's disabled state** and is *not* debounced. Error message *display* is debounced (400ms via `useDebounce`) to avoid flicker while typing. Credential correctness is checked only on submit and shown as a separate submit-level error — wrong-but-valid-length credentials do NOT disable the button.
- **Caching is per-page, TTL-based (5 min default).** `utils/cache.ts` is a generic `get/set/clear` wrapper around `localStorage`, storing `{ data, cachedAt }`. `services/swapi.ts` checks cache before every fetch unless `{ bypassCache: true }` is passed (used by the manual Refresh button). All `localStorage` calls are wrapped in try/catch and fail silently — caching is a nice-to-have, never a hard dependency.
- **Loading vs. Refreshing are separate states.** `isLoading` (first load / page change) replaces the whole view with `LoadingSpinner`. `isRefreshing` (manual force-refresh) keeps existing rows visible and only disables/relabels the Refresh button — avoids a jarring full-page flash on manual refresh.
- **Offline modal vs. inline error state are two different concerns.** `OfflineModal` (global, mounted in `App.tsx`) reacts to the browser's `online`/`offline` events via `useOnlineStatus` — this is what Chrome DevTools' Network→Offline throttle triggers, and matches the assignment's testing instructions exactly. `ErrorState` (page-level, in `Table.tsx`) is the fallback for a specific failed fetch (e.g., bad response status) and offers a Retry button. Both are needed; they cover different failure modes.
- **Offline modal "dismissed" state re-arms on each new offline transition** — otherwise a user who dismisses once during a long outage would never see it again after reconnecting and dropping again.
- **`fetchPeople` throws on `!response.ok`.** `fetch()` only rejects on network failure, not HTTP error codes — this is a common gotcha, handled explicitly.
- **SWAPI types are intentionally partial.** `Person` interface only types the 5 fields actually rendered (`name`, `mass`, `height`, `hair_color`, `skin_color`) plus `[key: string]: unknown` to allow the rest of SWAPI's response through without fighting TypeScript.
- **Mobile table becomes stacked cards below 640px**, using `data-label` attributes + `::before { content: attr(data-label) }` CSS trick instead of duplicating markup for a separate mobile view.

## Design System

Themed as an in-universe "archive terminal / HUD" — deliberately not a generic dark-mode SaaS look. Signature element: amber HUD corner-brackets (`::before`/`::after` pseudo-elements) on the login panel and 404 panel.

**Tokens** (`src/index.css`):
```css
--bg-void: #0B0D12;
--panel: #161A23;
--line: #2A303D;
--amber: #FFB347;      /* primary accent */
--cyan: #6FE3FF;       /* secondary/data accent */
--text-primary: #E8EAED;
--text-muted: #8A93A3;
--danger: #FF6B6B;

--font-display: 'JetBrains Mono', monospace;  /* headers, labels, data */
--font-body: 'Inter', sans-serif;             /* body copy */
```

Global conventions: `:focus-visible` uses amber glow (not default blue), `prefers-reduced-motion` is respected (spinner freezes, transitions disabled).

## Requirements Checklist (all met)

| Requirement | Where |
|---|---|
| Responsive login form, 2 fields | `LoginForm.tsx` |
| Validation: non-empty, 4–30 chars | `utils/validation.ts` |
| Button disabled when invalid | `LoginForm.tsx` |
| react-router-dom nav to `/table` | `App.tsx`, `AuthContext.tsx` |
| SWAPI fetch | `services/swapi.ts` |
| Fields: name, mass, height, hair_color, skin_color | `Table.tsx` |
| Pagination | `Pagination.tsx` |
| Responsive, visually appealing table | `Table.css` (card collapse < 640px) |
| Loading state | `LoadingSpinner.tsx` |
| localStorage caching + validation logic | `utils/cache.ts`, `services/swapi.ts` |
| Error handling | `ErrorState.tsx` |
| Offline modal (DevTools-testable) | `OfflineModal.tsx`, `useOnlineStatus.ts` |

**Extras added beyond spec:** debounced validation messages, manual force-refresh (cache bypass) button, themed 404 catch-all route.

## Test Credentials

- Username: `Martines`
- Password: `starwars`

## How to Verify Everything Still Works

1. `npm run dev`
2. `/` → try invalid lengths (button stays disabled), then valid-but-wrong creds (submit error), then correct creds → redirects to `/table`
3. `/table` directly (logged out) → redirects to `/`
4. `/table` (logged in) → spinner → table with 5 columns → paginate with Prev/Next → click Refresh (should re-fetch, bypassing cache — check Network tab)
5. DevTools → Network → Offline → modal appears; Dismiss it; go back Online; go Offline again → modal reappears
6. Visit a nonsense route (e.g. `/foo`) → themed 404 page → link back to `/`
7. Resize to <640px → table collapses to spaced-out cards

## Known Gaps / Possible Next Steps (not required, not started)

- No persistence of auth state across refresh (see decision above)
- No `logout()` UI hookup yet — the function exists in `AuthContext` but isn't wired to any button
- No unit/integration tests written
- No README with setup instructions (a build guide markdown was generated separately in this session, covering all code — could be adapted into a README)
- SWAPI's `swapi.py4e.com` mirror is third-party (original swapi.co is defunct) — worth a comment/fallback if it ever goes down

## Related Files From This Session

A full piece-by-piece build guide (all code blocks, in order) was also exported as `responsive-login-swapi-table-guide.md` — useful as a reference/tutorial, this `AGENTS.md` is the more compact "pick up where we left off" file.
