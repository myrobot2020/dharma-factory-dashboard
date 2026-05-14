import { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useOnboarding } from "./state";

export function useOnboardingGuard() {
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { skip?: string };
  useEffect(() => {
    if (state.completed) return;
    if (search?.skip === "1") return;
    navigate({ to: "/welcome" });
  }, [state.completed, search, navigate]);
}
