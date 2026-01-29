import { useEffect, useState } from "react";

function readStoredMode(): boolean | null {
  try {
    const params = new URLSearchParams(globalThis.location?.search ?? "");
    const mode = params.get("mode");
    if (mode === "dark") return true;
    if (mode === "light") return false;
  } catch {}

  const stored = localStorage.getItem("uiDarkMode");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return null;
}

function prefersDark(): boolean {
  return (
    globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
  );
}

export function useStandaloneDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(
    () => readStoredMode() ?? prefersDark(),
  );

  useEffect(() => {
    const handler = () => {
      setDarkMode(readStoredMode() ?? prefersDark());
    };
    globalThis.addEventListener("ui-dark-mode-changed", handler);
    globalThis.addEventListener("storage", handler);
    return () => {
      globalThis.removeEventListener("ui-dark-mode-changed", handler);
      globalThis.removeEventListener("storage", handler);
    };
  }, []);

  return darkMode;
}
