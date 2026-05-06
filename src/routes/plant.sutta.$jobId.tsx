import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CircleDot } from "lucide-react";
import { useJob } from "@/lib/plant/hooks";
import type { Artifact } from "@/lib/plant/types";

export const Route = createFileRoute("/plant/sutta/$jobId")({
  component: SuttaDetail,
});

const STAGES = [
  { key: "discovery", label: "Discovery", verbs: ["discovery.published"], wave: 0 as const },
  {
    key: "wave1",
    label: "Wave 1 — CPU",
    verbs: ["wave1.download.done", "wave1.extract.done", "wave1.segment.done"],
    wave: 1 as const,
  },
  {
    key: "wave2",
    label: "Wave 2 — GPU",
    verbs: ["wave2.gen.done", "wave2.translate.done", "wave2.dub.done"],
    wave: 2 as const,
  },
  {
    key: "wave3",
    label: "Wave 3 — Weaver",
    verbs: ["wave3.match.done", "wave3.weave.done", "wave3.validate.done"],
    wave: 3 as const,
  },
  { key: "seal", label: "Seal", verbs: ["seal.uploaded"], wave: 3 as const },
  { key: "rebuild", label: "Rebuild", verbs: ["rebuild.done"], wave: 3 as const },
];

function SuttaDetail() {
  const { jobId } = Route.useParams();
  const data = useJob(jobId);
  const [selected, setSelected] = useState<Artifact | null>(null);

  if (!data) {
    return (
      <div className="font-mono text-sm text-muted-foreground">loading {jobId}…</div>
    );
  }

  const { job, artifacts, events } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/plant"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> back to tape
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h2 className="font-serif text-3xl">{job.title}</h2>
          <StatusBadge status={job.status} />
        </div>
        <div className="mt-1 font-mono text-xs text-muted-foreground">
          {job.id} · {job.sutta_id} · source {job.source}
          {job.hash_id && (
            <>
              {" · "}
              <span className="text-primary">hash {job.hash_id}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Timeline */}
        <ol className="relative space-y-4 border-l border-border pl-6">
          {STAGES.map((stage) => {
            const stageEvents = events.filter((e) =>
              stage.verbs.includes(e.verb),
            );
            const stageArts = artifacts.filter((a) => {
              if (stage.key === "wave1") return ["video", "panels", "segments"].includes(a.kind);
              if (stage.key === "wave2") return ["mcq", "translation", "dub"].includes(a.kind);
              if (stage.key === "wave3") return a.kind === "weave";
              if (stage.key === "seal") return a.kind === "seal";
              return false;
            });
            const done = stageEvents.length > 0;
            return (
              <li key={stage.key} className="relative">
                <span
                  className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-background"
                  style={{
                    borderColor: done ? "var(--color-primary)" : "var(--color-border)",
                  }}
                >
                  {done && <CircleDot className="h-3 w-3 text-primary" />}
                </span>
                <div className="font-serif text-lg">{stage.label}</div>
                {stageEvents.length === 0 ? (
                  <div className="mt-1 font-mono text-xs text-muted-foreground/60">
                    pending
                  </div>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {stageEvents.map((e) => (
                      <li
                        key={e.id}
                        className="font-mono text-xs text-muted-foreground"
                      >
                        <span className="text-foreground/80">{e.verb}</span>
                        {e.model_version && (
                          <span className="ml-2 text-primary">{e.model_version}</span>
                        )}
                        <span className="ml-2">{new Date(e.ts).toLocaleTimeString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {stageArts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {stageArts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className="rounded-sm border border-border bg-card px-2 py-1 font-mono text-[10px] hover:border-primary/60"
                      >
                        <span className="text-foreground/80">{a.kind}</span>
                        <span className="ml-2 text-primary">{a.hash_id.slice(0, 8)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Side panel */}
        <aside className="rounded-md border border-border bg-card p-4">
          <h3 className="font-serif text-lg">Artifact</h3>
          {!selected ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Click any artifact chip to inspect raw JSON.
            </p>
          ) : (
            <pre className="mt-3 max-h-[60vh] overflow-auto rounded-md bg-background p-3 font-mono text-[11px] leading-relaxed text-foreground/80">
              {JSON.stringify(selected, null, 2)}
            </pre>
          )}
        </aside>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "sealed" || status === "rebuilt"
      ? "border-primary/50 bg-primary/10 text-primary"
      : status === "failed"
        ? "border-status-err/50 bg-status-err/10 text-status-err"
        : "border-border bg-secondary text-foreground/80";
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${tone}`}
    >
      {status}
    </span>
  );
}
