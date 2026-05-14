## Goal

Add a pre-install + first-open onboarding flow for the DAMA native app. All 8 screens are prototyped in this TanStack web app as a mobile-frame preview. Onboarding answers held in memory (no backend) via a small React context.

## New routes

Pre-install (public marketing — `/welcome` group):
```
/welcome              → Landing (1)
/welcome/value        → Value explanation (2)
/welcome/preview      → Sample sutta preview (3) — reuse "Dung sutta" mock
/welcome/install      → Install CTA + store badges (4)
```

First-open (mock native onboarding — `/onboarding` group):
```
/onboarding           → Splash (5) → auto-advances after ~1.2s
/onboarding/intent    → Beginner / Daily reader / Deep study + tone (6)
/onboarding/reason    → Stress / learning / meditation / curiosity (7)
/onboarding/permissions → Notifications + offline (8) → done → "/"
```

Existing `/` (home with Plant/AN Nikāya/Tree/Reflect/Self tiles) is the "app opened" state and stays as-is.

## Flow + state

- `src/lib/onboarding/state.tsx` — React context + provider holding `{ intent, tone, reason, notifications, offline, completed }`. Memory only.
- `src/lib/onboarding/guard.tsx` — small helper that, on first visit to `/`, checks `completed`. If false → redirect to `/welcome`. Toggleable via `?skip=1` for dev.
- Provider mounted in `__root.tsx` so all routes can read/write.
- Progress dots component shared across both flows (4 dots pre-install, 4 dots onboarding).
- "Skip" link in onboarding header → marks completed and jumps to `/`.

## Look & feel

Match existing aesthetic from the uploaded screens:
- Cream background, ink/serif headings, mono micro-labels (DAMA tracking).
- Mobile-first: max-w ~420px, generous vertical rhythm.
- Calm, minimal — one focal element per screen, primary CTA at bottom.
- Lucide icons at stroke 1.5 like current home.
- Use existing tokens in `src/styles.css`; no new colors.

## Screen contents

1. **Landing** — DAMA wordmark, one-line purpose ("A quiet place to read, reflect, and remember the Dhamma."), hero ink illustration, two CTAs: "Continue" → /welcome/value, "I already have the app" → /onboarding.
2. **Value** — three stacked rows (Read suttas / Reflect daily / Track practice) each with icon + 1-line description. Bottom: "Continue".
3. **Preview** — embed a styled "Dung sutta" card (header chips Aṅguttara › Book of Ones › AN 1.18.13, title, blockquote, "next sutta" footer) exactly like uploaded screenshot. CTA: "See how it works".
4. **Install** — "Install to continue", App Store + Play Store badge placeholders, small print "Already installed? Open the app." → /onboarding.
5. **Splash** — centered DAMA mark + faint mandala, auto-redirects to /onboarding/intent after 1200ms.
6. **Intent** — two question groups:
   - Reading depth: Beginner / Daily reader / Deep study (single select chips)
   - Tone: Calm / Analytical / Devotional
   Continue enabled when both picked.
7. **Reason** — "What brings you here?" multi-select chips: Stress, Learning, Meditation, Curiosity, Other. Skippable.
8. **Permissions** — two toggles (Daily sutta reminder, Download for offline). "Allow & finish" → marks completed, navigates to `/`.

## Technical details

- `head()` per route with route-specific title + description + og:title/og:description; canonical only on leaves. `/onboarding/*` gets `noindex` (private flow).
- Preview viewport set to mobile via `preview_ui--set_preview_device_viewport` after build.
- No new deps. Pure React + TanStack Router + Tailwind tokens.
- Sample sutta text comes from existing mock; no Cloud call.
- Splash timer cleaned up in useEffect return.
- Progress dots and chip components live in `src/components/onboarding/`.

## Files to create

```
src/lib/onboarding/state.tsx
src/lib/onboarding/guard.tsx
src/components/onboarding/ProgressDots.tsx
src/components/onboarding/Chip.tsx
src/components/onboarding/MobileFrame.tsx       (max-w wrapper + header)
src/routes/welcome.tsx                          (layout w/ Outlet + progress)
src/routes/welcome.index.tsx                    (1)
src/routes/welcome.value.tsx                    (2)
src/routes/welcome.preview.tsx                  (3)
src/routes/welcome.install.tsx                  (4)
src/routes/onboarding.tsx                       (layout, splash on index)
src/routes/onboarding.index.tsx                 (5 splash)
src/routes/onboarding.intent.tsx                (6)
src/routes/onboarding.reason.tsx                (7)
src/routes/onboarding.permissions.tsx           (8)
```

## Files to edit

- `src/routes/__root.tsx` — wrap children in `<OnboardingProvider>`.
- `src/routes/index.tsx` — call `useOnboardingGuard()` on mount (redirects to `/welcome` until completed). Honors `?skip=1`.

## Out of scope (intentionally)

- Persistence (in-memory per user choice).
- Real native install / store links — placeholder buttons.
- Image-↔-sutta curation page — separate plan as requested.
- Any analytics / event tracking.