import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chip, PrimaryButton } from "@/components/onboarding/Chip";
import { useOnboarding, type Depth, type Tone } from "@/lib/onboarding/state";

export const Route = createFileRoute("/onboarding/intent")({
  component: Intent,
});

const depths: { id: Depth; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "daily", label: "Daily reader" },
  { id: "deep", label: "Deep study" },
];
const tones: { id: Tone; label: string }[] = [
  { id: "calm", label: "Calm" },
  { id: "analytical", label: "Analytical" },
  { id: "devotional", label: "Devotional" },
];

function Intent() {
  const navigate = useNavigate();
  const { state, set } = useOnboarding();
  const ready = state.depth && state.tone;
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif text-3xl text-foreground">How will you read?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a depth and a tone. You can change this later.
      </p>

      <div className="mt-8">
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">DEPTH</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {depths.map((d) => (
            <Chip key={d.id} active={state.depth === d.id} onClick={() => set("depth", d.id)}>
              {d.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">TONE</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tones.map((t) => (
            <Chip key={t.id} active={state.tone === t.id} onClick={() => set("tone", t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-10">
        <PrimaryButton
          disabled={!ready}
          onClick={() => navigate({ to: "/onboarding/reason" })}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
