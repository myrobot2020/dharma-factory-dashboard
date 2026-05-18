import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { MobileFrame } from "@/components/onboarding/MobileFrame";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { ZenTransition } from "@/components/onboarding/ZenTransition";

const order = ["/welcome", "/welcome/value", "/welcome/preview", "/welcome/install"];

export const Route = createFileRoute("/welcome")({
  component: WelcomeLayout,
});

function WelcomeLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const idx = Math.max(0, order.indexOf(pathname));
  return (
    <MobileFrame>
      <ProgressDots total={order.length} current={idx} />
      <main className="flex flex-1 flex-col pb-8">
        <ZenTransition>
          <Outlet />
        </ZenTransition>
      </main>
    </MobileFrame>
  );
}
