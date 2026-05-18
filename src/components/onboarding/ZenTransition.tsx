import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Re-keys children on every pathname change so the zen-page CSS animation
 * (breath-in + soft stagger) replays as users navigate between screens.
 */
export function ZenTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="zen-page flex flex-1 flex-col">
      {children}
    </div>
  );
}
