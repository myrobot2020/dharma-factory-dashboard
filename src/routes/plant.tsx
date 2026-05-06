import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Moon, Sun, Activity, Layers, Database } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { getPlantClient } from "@/lib/plant/client";

export const Route = createFileRoute("/plant")({
  head: () => ({
    meta: [
      { title: "Plant — Dama" },
      { name: "description", content: "Tickerplant operations console." },
    ],
  }),
  component: PlantLayout,
});

const tabs = [
  { to: "/plant", label: "Tape", icon: Activity, exact: true },
  { to: "/plant/waves", label: "Waves", icon: Layers, exact: false },
  { to: "/plant/hdb", label: "HDB", icon: Database, exact: false },
];

function PlantLayout() {
  const [theme, setTheme] = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span className="font-mono text-xs tracking-[0.3em]">DAMA</span>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <h1 className="font-serif text-xl text-foreground">Plant</h1>

          <nav className="ml-6 flex items-center gap-1">
            {tabs.map((t) => {
              const active = t.exact ? path === t.to : path.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <DevControls />
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Moon className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function DevControls() {
  const [mounted, setMounted] = useState(false);
  const [speed, setSpeed] = useState(1);
  useEffect(() => {
    setMounted(true);
    const c = getPlantClient();
    setSpeed(c.controls?.getSpeed() ?? 1);
  }, []);

  if (!mounted) return null;
  const client = getPlantClient();
  return (
    <div className="hidden items-center gap-2 md:flex">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        sim
      </span>
      <select
        value={speed}
        onChange={(e) => {
          const v = Number(e.target.value);
          setSpeed(v);
          client.controls!.setSpeed(v);
        }}
        className="h-7 rounded-md border border-border bg-card px-2 font-mono text-xs text-foreground"
      >
        {[0.5, 1, 2, 4].map((s) => (
          <option key={s} value={s}>
            {s}×
          </option>
        ))}
      </select>
      <button
        onClick={() => client.controls!.spawnSutta()}
        className="h-7 whitespace-nowrap rounded-md border border-border px-2 font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        + sutta
      </button>
      <button
        onClick={() => client.controls!.failNextGen()}
        className="h-7 whitespace-nowrap rounded-md border border-border px-2 font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        fail gen
      </button>
    </div>
  );
}
