import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Download } from "lucide-react";
import { PrimaryButton } from "@/components/onboarding/Chip";
import { useOnboarding } from "@/lib/onboarding/state";

export const Route = createFileRoute("/onboarding/permissions")({
  component: Permissions,
});

function Toggle({
  icon: Icon,
  title,
  desc,
  value,
  onChange,
}: {
  icon: typeof Bell;
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-start gap-4 rounded-md border border-border bg-card p-4 text-left"
    >
      <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
      <div className="flex-1">
        <h2 className="font-serif text-lg text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
      <span
        className={`mt-1 h-6 w-10 shrink-0 rounded-full border transition-colors ${
          value ? "border-primary bg-primary/30" : "border-border bg-background"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-foreground transition-transform ${
            value ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

function Permissions() {
  const navigate = useNavigate();
  const { state, set, complete } = useOnboarding();

  const finish = () => {
    complete();
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif text-3xl text-foreground">A couple of permissions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Both optional. You can change them in Settings.
      </p>

      <div className="mt-8 space-y-3">
        <Toggle
          icon={Bell}
          title="Daily sutta reminder"
          desc="One quiet nudge at your chosen hour."
          value={state.notifications}
          onChange={(v) => set("notifications", v)}
        />
        <Toggle
          icon={Download}
          title="Download for offline"
          desc="~40 MB. Read on the train, in the woods."
          value={state.offline}
          onChange={(v) => set("offline", v)}
        />
      </div>

      <div className="mt-auto pt-10">
        <PrimaryButton onClick={finish}>Allow & finish</PrimaryButton>
      </div>
    </div>
  );
}
