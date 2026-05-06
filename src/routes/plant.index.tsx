import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { usePlantTape } from "@/lib/plant/hooks";
import type { EventVerb, PlantEvent } from "@/lib/plant/types";

export const Route = createFileRoute("/plant/")({
  component: TapeView,
});

const VERB_COLOR: Record<string, string> = {
  discovery: "text-muted-foreground",
  wave1: "text-wave-cpu",
  wave2: "text-wave-gpu",
  wave3: "text-wave-weaver",
  seal: "text-primary",
  rebuild: "text-wave-seal",
};

function colorForVerb(v: EventVerb) {
  const head = v.split(".")[0];
  return VERB_COLOR[head] ?? "text-foreground";
}

function fmtTime(ts: number) {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  const ms = d.getMilliseconds().toString().padStart(3, "0");
  return `${h}:${m}:${s}.${ms}`;
}

function TapeView() {
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<string>("");
  const [waveFilter, setWaveFilter] = useState<string>("all");
  const events = usePlantTape(paused);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (waveFilter !== "all" && String(e.wave) !== waveFilter) return false;
      if (!filter) return true;
      const q = filter.toLowerCase();
      return (
        e.verb.includes(q) ||
        e.sutta_id.toLowerCase().includes(q) ||
        e.job_id.toLowerCase().includes(q)
      );
    });
  }, [events, filter, waveFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Live Tape</h2>
          <p className="text-sm text-muted-foreground">
            Ordered event log from Feed Handlers and Waves.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="filter verb / sutta / job"
            className="h-8 w-56 rounded-md border border-border bg-card px-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60"
          />
          <select
            value={waveFilter}
            onChange={(e) => setWaveFilter(e.target.value)}
            className="h-8 rounded-md border border-border bg-card px-2 font-mono text-xs"
          >
            <option value="all">all waves</option>
            <option value="0">discovery</option>
            <option value="1">wave 1</option>
            <option value="2">wave 2</option>
            <option value="3">wave 3</option>
          </select>
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2 font-mono text-xs hover:bg-secondary"
          >
            {paused ? (
              <>
                <Play className="h-3 w-3" strokeWidth={2} /> resume
              </>
            ) : (
              <>
                <Pause className="h-3 w-3" strokeWidth={2} /> pause
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="grid grid-cols-[110px_60px_1fr_140px_100px] border-b border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>time</span>
          <span>wave</span>
          <span>verb</span>
          <span>sutta</span>
          <span className="text-right">job</span>
        </div>
        <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-3 py-12 text-center font-mono text-xs text-muted-foreground">
              awaiting events…
            </div>
          )}
          {filtered.map((e, i) => (
            <TapeRow key={e.id} e={e} alt={i % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TapeRow({ e, alt }: { e: PlantEvent; alt: boolean }) {
  return (
    <Link
      to="/plant/sutta/$jobId"
      params={{ jobId: e.job_id }}
      className="grid grid-cols-[110px_60px_1fr_140px_100px] items-center px-3 py-1.5 font-mono text-xs hover:bg-secondary/60"
      style={{ backgroundColor: alt ? "var(--color-tape-row-alt)" : "var(--color-tape-row)" }}
    >
      <span className="text-muted-foreground">{fmtTime(e.ts)}</span>
      <span className="text-muted-foreground">{e.wave === 0 ? "—" : `w${e.wave}`}</span>
      <span className={colorForVerb(e.verb)}>{e.verb}</span>
      <span className="truncate text-foreground/80">{e.sutta_id}</span>
      <span className="truncate text-right text-muted-foreground">{e.job_id}</span>
    </Link>
  );
}
