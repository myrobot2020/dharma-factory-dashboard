import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Apple, Smartphone } from "lucide-react";
import { PrimaryButton } from "@/components/onboarding/Chip";

export const Route = createFileRoute("/welcome/install")({
  head: () => ({
    meta: [
      { title: "Install DAMA" },
      { name: "description", content: "Install DAMA to continue your practice." },
      { property: "og:title", content: "Install DAMA" },
      { property: "og:description", content: "Install DAMA to continue your practice." },
      { property: "og:url", content: "/welcome/install" },
    ],
    links: [{ rel: "canonical", href: "/welcome/install" }],
  }),
  component: Install,
});

function StoreBadge({ icon: Icon, top, bottom }: { icon: typeof Apple; top: string; bottom: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/60">
      <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">{top}</p>
        <p className="font-serif text-base text-foreground">{bottom}</p>
      </div>
    </button>
  );
}

function Install() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif text-3xl text-foreground">Install to continue</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The full library, daily reminders, and offline reading live in the app.
      </p>
      <div className="mt-8 space-y-3">
        <StoreBadge icon={Apple} top="DOWNLOAD ON THE" bottom="App Store" />
        <StoreBadge icon={Smartphone} top="GET IT ON" bottom="Google Play" />
      </div>
      <div className="mt-auto space-y-2 pt-10">
        <PrimaryButton onClick={() => navigate({ to: "/onboarding" })}>
          I've installed it — open
        </PrimaryButton>
        <Link
          to="/onboarding"
          className="block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Already installed? Open the app.
        </Link>
      </div>
    </div>
  );
}
