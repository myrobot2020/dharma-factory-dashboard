import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/onboarding/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/onboarding/intent" }), 1200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 -m-12 rounded-full bg-primary/5 blur-2xl" />
        <span className="relative font-serif text-5xl tracking-wide text-foreground">DAMA</span>
      </div>
      <p className="mt-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
        OPENING
      </p>
    </div>
  );
}
