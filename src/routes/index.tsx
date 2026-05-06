import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Trees, Sparkles, User, Activity } from "lucide-react";
import heroImg from "@/assets/dama-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dama" },
      { name: "description", content: "A Buddhist data factory." },
    ],
  }),
  component: Index,
});

const tiles = [
  { to: "/plant", title: "Plant", subtitle: "Tickerplant ops", icon: Activity, accent: true },
  { to: "/", title: "AN Nikāya", subtitle: "Suttas", icon: BookOpen },
  { to: "/", title: "Tree", subtitle: "Progress", icon: Trees },
  { to: "/", title: "Reflect", subtitle: "Practice", icon: Sparkles },
  { to: "/", title: "Self", subtitle: "Profile", icon: User },
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-center py-6">
        <span className="font-mono text-xs tracking-[0.4em] text-muted-foreground">
          DAMA
        </span>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-md border border-border">
          <img
            src={heroImg}
            alt="Manga ink mountain landscape"
            width={1920}
            height={640}
            className="h-48 w-full object-cover sm:h-64 md:h-80"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2">
          {tiles.map((t) => (
            <Link
              key={t.title}
              to={t.to}
              className="group rounded-md border border-border bg-card p-6 transition-colors hover:border-primary/60"
            >
              <t.icon
                className={`h-5 w-5 ${"accent" in t && t.accent ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={1.5}
              />
              <h2 className="mt-12 font-serif text-3xl text-foreground">
                {t.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
