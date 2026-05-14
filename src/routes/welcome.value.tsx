import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, Sparkles, Trees } from "lucide-react";
import { PrimaryButton } from "@/components/onboarding/Chip";

export const Route = createFileRoute("/welcome/value")({
  head: () => ({
    meta: [
      { title: "What DAMA does" },
      { name: "description", content: "Read suttas, reflect daily, track practice." },
      { property: "og:title", content: "What DAMA does" },
      { property: "og:description", content: "Read suttas, reflect daily, track practice." },
      { property: "og:url", content: "/welcome/value" },
    ],
    links: [{ rel: "canonical", href: "/welcome/value" }],
  }),
  component: Value,
});

const rows = [
  { icon: BookOpen, title: "Read suttas", desc: "Curated, segmented, easy to dwell on." },
  { icon: Sparkles, title: "Reflect daily", desc: "One verse, one question, one breath." },
  { icon: Trees, title: "Track practice", desc: "Your Tree grows with each sitting." },
];

function Value() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif text-3xl text-foreground">What this app does</h1>
      <div className="mt-8 flex-1 space-y-6">
        {rows.map((r) => (
          <div key={r.title} className="flex gap-4 rounded-md border border-border bg-card p-4">
            <r.icon className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
            <div>
              <h2 className="font-serif text-lg text-foreground">{r.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <PrimaryButton onClick={() => navigate({ to: "/welcome/preview" })}>Continue</PrimaryButton>
    </div>
  );
}
