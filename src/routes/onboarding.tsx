import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { MobileFrame } from "@/components/onboarding/MobileFrame";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { ZenTransition } from "@/components/onboarding/ZenTransition";
import { useOnboarding } from "@/lib/onboarding/state";

const order = ["/onboarding", "/onboarding/intent", "/onboarding/reason", "/onboarding/permissions"];

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to DAMA" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingLayout,
});

function OnboardingLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { complete } = useOnboarding();
  const idx = Math.max(0, order.indexOf(pathname));
  const showChrome = pathname !== "/onboarding"; // hide on splash

  const skip = () => {
    complete();
    navigate({ to: "/", search: { skip: "1" } as never });
  };

  return (
    <MobileFrame
      rightSlot={
        showChrome ? (
          <button
            onClick={skip}
            className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            SKIP
          </button>
        ) : null
      }
    >
      {showChrome ? <ProgressDots total={order.length} current={idx} /> : null}
      <main className="flex flex-1 flex-col pb-8">
        <Outlet />
      </main>
    </MobileFrame>
  );
}
