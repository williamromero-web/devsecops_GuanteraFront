import { useMemo } from "react";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpPostForm,
  httpPut,
  httpPutForm,
  httpRequest,
  resolveApiBaseUrl,
} from "../lib/httpClient";
import { useGuanteraApiOptions } from "../providers/GuanteraProvider";

export interface GuanteraApi {
  buildUrl: (path: string) => string;

  fetchJson: <T>(path: string, init?: RequestInit) => Promise<T>;
  get: <T>(path: string) => Promise<T>;
  post: <T>(path: string, body: unknown) => Promise<T>;
  put: <T>(path: string, body: unknown) => Promise<T>;
  delete: <T>(path: string) => Promise<T>;
  postForm: <T>(path: string, body: FormData) => Promise<T>;
  putForm: <T>(path: string, body: FormData) => Promise<T>;
}

export function useGuanteraApi(): GuanteraApi {
  const options = useGuanteraApiOptions();

  return useMemo<GuanteraApi>(
    () => ({
      buildUrl(path: string) {
        const normalizedBase = resolveApiBaseUrl(options.baseUrl);
        const normalizedPath = path.replace(/^\//, "");
        return `${normalizedBase}/${normalizedPath}`;
      },

      async fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
        return httpRequest<T>(path, init ?? { method: "GET" }, options);
      },

      async get<T>(path: string): Promise<T> {
        return httpGet<T>(path, options);
      },

      async post<T>(path: string, body: unknown): Promise<T> {
        return httpPost<T>(path, body, options);
      },

      async put<T>(path: string, body: unknown): Promise<T> {
        return httpPut<T>(path, body, options);
      },

      async delete<T>(path: string): Promise<T> {
        return httpDelete<T>(path, options);
      },

      async postForm<T>(path: string, body: FormData): Promise<T> {
        return httpPostForm<T>(path, body, options);
      },

      async putForm<T>(path: string, body: FormData): Promise<T> {
        return httpPutForm<T>(path, body, options);
      },
    }),
    [options],
  );
}
