import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useOnboarding } from "./state";

export function useOnboardingGuard() {
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search });
  useEffect(() => {
    if (state.completed) return;
    const skip = typeof search === "string" ? search.includes("skip=1") : (search as Record<string, unknown>)?.skip === "1";
    if (skip) return;
    navigate({ to: "/welcome" });
  }, [state.completed, search, navigate]);
}
