import { useMemo } from "react";
import { useGuanteraConfig } from "../providers/GuanteraProvider";

export interface GuanteraApi {
  buildUrl: (path: string) => string;

  fetchJson: <T>(path: string, init?: RequestInit) => Promise<T>;
}

export function useGuanteraApi(): GuanteraApi {
  const { baseUrl } = useGuanteraConfig();

  const effectiveBaseUrl =
    baseUrl ?? (import.meta.env.VITE_GLOVE_API_URL as string | undefined) ?? "";

  return useMemo<GuanteraApi>(
    () => ({
      buildUrl(path: string) {
        if (!effectiveBaseUrl) {
          return path;
        }
        const normalizedBase = effectiveBaseUrl.replace(/\/$/, "");
        const normalizedPath = path.replace(/^\//, "");
        return `${normalizedBase}/${normalizedPath}`;
      },
      // Maquetado Fase 8: implementación mock, sin llamadas reales.
      async fetchJson<T>(): Promise<T> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {} as any as T;
      },
    }),
    [effectiveBaseUrl],
  );
}
