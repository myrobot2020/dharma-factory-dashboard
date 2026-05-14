import { createContext, useContext, useState, type ReactNode } from "react";

export type Depth = "beginner" | "daily" | "deep";
export type Tone = "calm" | "analytical" | "devotional";
export type Reason = "stress" | "learning" | "meditation" | "curiosity" | "other";

export type OnboardingState = {
  depth: Depth | null;
  tone: Tone | null;
  reasons: Reason[];
  notifications: boolean;
  offline: boolean;
  completed: boolean;
};

type Ctx = {
  state: OnboardingState;
  set: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
  toggleReason: (r: Reason) => void;
  complete: () => void;
  reset: () => void;
};

const initial: OnboardingState = {
  depth: null,
  tone: null,
  reasons: [],
  notifications: true,
  offline: true,
  completed: false,
};

const OnboardingCtx = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initial);
  const set: Ctx["set"] = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const toggleReason = (r: Reason) =>
    setState((s) => ({
      ...s,
      reasons: s.reasons.includes(r) ? s.reasons.filter((x) => x !== r) : [...s.reasons, r],
    }));
  const complete = () => setState((s) => ({ ...s, completed: true }));
  const reset = () => setState(initial);
  return (
    <OnboardingCtx.Provider value={{ state, set, toggleReason, complete, reset }}>
      {children}
    </OnboardingCtx.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingCtx);
  if (!ctx) throw new Error("useOnboarding must be inside OnboardingProvider");
  return ctx;
}
