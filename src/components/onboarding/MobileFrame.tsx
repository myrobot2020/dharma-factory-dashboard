import type { ReactNode } from "react";

export function MobileFrame({
  children,
  topLabel = "DAMA",
  rightSlot,
}: {
  children: ReactNode;
  topLabel?: string;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-6">
        <header className="relative flex items-center justify-center py-6">
          <span className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground">
            {topLabel}
          </span>
          {rightSlot ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightSlot}</div>
          ) : null}
        </header>
        {children}
      </div>
    </div>
  );
}
