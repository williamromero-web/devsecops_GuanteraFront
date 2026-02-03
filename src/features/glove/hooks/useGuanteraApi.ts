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

      async fetchJson<T>(): Promise<T> {
        return {} as any as T;
      },
    }),
    [effectiveBaseUrl],
  );
}
