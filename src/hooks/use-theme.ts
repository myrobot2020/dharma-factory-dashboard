import { useEffect, useState } from "react";

const KEY = "dama.theme";
type Mode = "light" | "dark";

function apply(mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function useTheme(): [Mode, (m: Mode) => void] {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) as Mode | null;
    const initial: Mode = saved ?? "light";
    setMode(initial);
    apply(initial);
  }, []);

  const set = (m: Mode) => {
    setMode(m);
    apply(m);
    try {
      localStorage.setItem(KEY, m);
    } catch {
      /* ignore */
    }
  };

  return [mode, set];
}
