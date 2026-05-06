## Dama Plant — Dev Dashboard

A monitoring console for your local tickerplant-style data pipeline, built in the same Buddhist/data-factory voice as the Dama app. Light mode for meditative browsing, dark mode for live ops. Backed by a typed mock adapter now so we can design and ship the full UI today, then swap to your real plant by changing one env var later.

### Routes

- `/` — minimal home tile grid in your existing aesthetic (cream + ink + gold serif), with a new **Plant** tile linking to `/plant`. Keeps the door open to AN Nikāya / Tree / etc. tiles you'll add elsewhere.
- `/plant` — dashboard shell with three tabs: **Tape**, **Waves**, **HDB**.
- `/plant/sutta/$jobId` — sutta lifecycle detail page.

### Views (v1)

**1. Live Tape (event stream)**
Bloomberg-style scrolling log of every Pub event from Feed Handlers and Waves. Mono font, tight rows, subtle row striping, color-coded verbs (CPU = sage, GPU = saffron, Weaver = gold, Seal = ink). Filters: by wave, by job, by verb. Pause/resume tail. Click a row → jump to that sutta's detail page.

**2. Wave Board**
Three columns mirroring the diagram:
- *Wave 1 — Parallel CPU (8 grunts)*: 8 slot cards, each showing current task (download / extract / segment), job hash, elapsed.
- *Wave 2 — Sequential GPU (1 lock)*: lock holder card with sub-stage indicator (Gen → Translate → Dub), VRAM-loaded badge, queue depth behind it.
- *Wave 3 — Weaver & Seal*: pipeline of Match → Weave → Validate → Seal, with the current sutta and "ready to seal" count.
Top strip: throughput sparkline (suttas/hour), GPU utilization, error count.

**3. Sutta Lifecycle Detail (`/plant/sutta/$jobId`)**
Vertical timeline: Discovery → CPU artifacts → GPU artifacts → Weaver merge → Seal → Rebuild. Each node shows artifact name, Hash-ID, model version, duration, and a "golden / re-seal needed" badge. Click an artifact → side panel with raw JSON.

**4. GCS HDB Browser**
Sealed artifacts table sorted by Hash-ID. Filters: model version, content hash prefix, sutta ID. Columns: Hash-ID, Sutta, Model, Sealed at, Size. Empty-state copy explains the Hash-ID = content hash + model version contract.

### Aesthetic — dual mode, same tokens

Theme toggle in the dashboard header (persists to localStorage).

- **Light (meditative)**: cream `#fcfbf8` background, ink foreground, gold accent (`oklch(~0.62 0.13 80)` saffron), Cormorant/Lora serif for headings, Inter for body, IBM Plex Mono for the tape and Hash-IDs. Generous whitespace.
- **Dark (ops)**: deep ink background, warm bone foreground, same saffron/gold accent, denser line-height for the tape, slightly stronger row striping. Same component layout — only tokens flip.

All colors live as semantic CSS variables in `src/styles.css` (`--background`, `--foreground`, `--primary`, `--accent`, `--wave-cpu`, `--wave-gpu`, `--wave-weaver`, `--wave-seal`, `--status-ok`, `--status-warn`, `--status-err`). Components reference tokens only — no hardcoded colors.

### Plant adapter (mock now, real later)

A single TypeScript interface `PlantClient` with two implementations behind a factory chosen by `VITE_PLANT_MODE`:

- **`mock`** (default): in-memory simulator that emits a realistic event stream — discovery → 8-thread CPU wave → GPU lock acquired → sequential gen/translate/dub → weaver → seal — at adjustable speed. Drives all four views with believable data, including occasional failures and re-seals. A small dev panel on `/plant` exposes "speed", "spawn sutta", "fail next gen" buttons so you can stress-test the UI.
- **`http`** (future): same interface, points at your local plant. You'll implement these endpoints on the plant side; the dashboard already speaks the protocol.

**Wire protocol (documented for when you implement the real plant):**

```text
GET  /events?since=<cursor>&limit=200       -> Event[]
WS   /ws/events                              -> Event stream (push)
GET  /jobs?status=&wave=                     -> Job[]
GET  /jobs/:id                               -> Job + Artifact[] + Event[]
GET  /artifacts?hash_prefix=&model=          -> Artifact[]
GET  /waves                                  -> { wave1: Slot[8], wave2: GpuSlot, wave3: WeaverState }
```

**Event vocabulary (matches your diagram):**
`discovery.published`, `wave1.download.started|done`, `wave1.extract.done`, `wave1.segment.done`, `wave2.gpu.lock.acquired|released`, `wave2.gen.done`, `wave2.translate.done`, `wave2.dub.done`, `wave3.match.done`, `wave3.weave.done`, `wave3.validate.done|failed`, `seal.uploaded`, `rebuild.done`.

Every event carries: `id`, `ts`, `verb`, `job_id`, `sutta_id`, `wave`, `payload` (verb-specific), `hash_id?`, `model_version?`.

### Technical notes

- TanStack Router file routes: `src/routes/plant.tsx` (layout shell with tabs + theme toggle + Outlet), `src/routes/plant.index.tsx` (Tape default), `src/routes/plant.waves.tsx`, `src/routes/plant.hdb.tsx`, `src/routes/plant.sutta.$jobId.tsx`. Update `src/routes/index.tsx` to a real home grid.
- Add TanStack Query + `QueryClientProvider` in `__root.tsx` per the integration guide (queryClient in router context, `defaultPreloadStaleTime: 0`, fresh client per request for SSR).
- Mock adapter lives in `src/lib/plant/` — `types.ts`, `client.ts` (interface + factory), `mock-client.ts` (simulator with EventTarget for live subscriptions), `http-client.ts` (stub raising "not implemented" until you turn it on). React hooks: `usePlantEvents()`, `useWaves()`, `useJob(id)`, `useArtifacts(filters)`.
- Tape uses a virtualized list (windowed rendering) so a long-running session stays smooth; auto-scroll pauses when the user scrolls up.
- Theme toggle adds/removes `dark` class on `<html>`; tokens already split via `:root` and `.dark` blocks in `styles.css`.
- All page heads set route-specific `<title>`/meta per TanStack route conventions.

### Out of scope for v1 (call out, don't build)

- Auth — dashboard is open inside the project; add later if you publish.
- Triggering re-seals or replays from the UI — read-only monitoring first.
- Persistent history beyond what the plant API returns — dashboard is a viewer, plant is the source of truth.

### Acceptance

- `/` renders a calm tile grid including a **Plant** tile.
- `/plant` shows live ticking tape, populated wave board, and HDB list driven by the mock simulator.
- `/plant/sutta/<id>` shows full lifecycle for any job in the tape.
- Light/dark toggle flips the entire dashboard with no hardcoded colors anywhere.
- Switching `VITE_PLANT_MODE=http` causes the dashboard to call the documented endpoints — no other code changes needed when your real plant is ready.