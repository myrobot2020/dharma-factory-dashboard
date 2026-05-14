import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chip, PrimaryButton, GhostButton } from "@/components/onboarding/Chip";
import { useOnboarding, type Reason } from "@/lib/onboarding/state";

export const Route = createFileRoute("/onboarding/reason")({
  component: ReasonStep,
});

const reasons: { id: Reason; label: string }[] = [
  { id: "stress", label: "Stress" },
  { id: "learning", label: "Learning" },
  { id: "meditation", label: "Meditation" },
  { id: "curiosity", label: "Curiosity" },
  { id: "other", label: "Other" },
];

function ReasonStep() {
  const navigate = useNavigate();
  const { state, toggleReason } = useOnboarding();
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif text-3xl text-foreground">What brings you here?</h1>
      <p className="mt-2 text-sm text-muted-foreground">Pick any that fit. Optional.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {reasons.map((r) => (
          <Chip key={r.id} active={state.reasons.includes(r.id)} onClick={() => toggleReason(r.id)}>
            {r.label}
          </Chip>
        ))}
      </div>

      <div className="mt-auto space-y-2 pt-10">
        <PrimaryButton onClick={() => navigate({ to: "/onboarding/permissions" })}>
          Continue
        </PrimaryButton>
        <GhostButton onClick={() => navigate({ to: "/onboarding/permissions" })}>
          Skip
        </GhostButton>
      </div>
    </div>
  );
}
