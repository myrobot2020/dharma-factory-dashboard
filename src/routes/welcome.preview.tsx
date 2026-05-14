import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PrimaryButton } from "@/components/onboarding/Chip";

export const Route = createFileRoute("/welcome/preview")({
  head: () => ({
    meta: [
      { title: "A taste — Dung sutta (AN 1.18.13)" },
      { name: "description", content: "Read a real sutta before you install." },
      { property: "og:title", content: "A taste — Dung sutta (AN 1.18.13)" },
      { property: "og:description", content: "Read a real sutta before you install." },
      { property: "og:url", content: "/welcome/preview" },
    ],
    links: [{ rel: "canonical", href: "/welcome/preview" }],
  }),
  component: Preview,
});

function Preview() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col">
      <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">A TASTE</p>
      <div className="mt-4 rounded-md border border-border bg-card p-5">
        <p className="text-[11px] text-muted-foreground">
          <span className="text-primary">●</span> Aṅguttara Nikāya · Book of Ones · AN 1.18.13
        </p>
        <h1 className="mt-3 font-serif text-3xl text-foreground">Dung sutta</h1>
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">SUTTA</p>
          <blockquote className="mt-3 font-serif text-lg leading-relaxed text-foreground">
            "The Buddha said monks just as even a trifling bit of dung has an evil smell so
            likewise do I not favor existing even for a trifling time not even for the lasting
            of a finger snap."
          </blockquote>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Two hundred more like this. Short, sharp, daily.
      </p>
      <div className="mt-auto pt-8">
        <PrimaryButton onClick={() => navigate({ to: "/welcome/install" })}>
          See how it works
        </PrimaryButton>
      </div>
    </div>
  );
}
