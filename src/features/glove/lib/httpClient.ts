export interface HttpClientOptions {
  baseUrl?: string;
  getHeaders?: () => Record<string, string>;
}

export interface ApiClientRuntimeConfig {
  baseUrl?: string | null;
  getAuthHeaders?: () => Record<string, string>;
}

interface RequestOptions {
  includeJsonContentType?: boolean;
}

let runtimeConfig: ApiClientRuntimeConfig = {};

const DEFAULT_BASE_URL =
  (import.meta.env.VITE_GLOVE_API_URL as string | undefined) ??
  "http://localhost:8087/glove";

export function setApiClientConfig(config: ApiClientRuntimeConfig): void {
  runtimeConfig = {
    ...runtimeConfig,
    ...config,
  };
}

export function getApiClientConfig(): ApiClientRuntimeConfig {
  return runtimeConfig;
}

export function resolveApiBaseUrl(overrideBaseUrl?: string): string {
  const baseUrl = overrideBaseUrl ?? runtimeConfig.baseUrl ?? DEFAULT_BASE_URL;
  return baseUrl.replace(/\/$/, "");
}

function buildUrl(path: string, baseUrl?: string): string {
  const normalizedBase = resolveApiBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function buildHeaders(
  headers: HeadersInit | undefined,
  options: HttpClientOptions | undefined,
  includeJsonContentType: boolean,
): Headers {
  const result = new Headers(headers);

  if (includeJsonContentType && !result.has("Content-Type")) {
    result.set("Content-Type", "application/json");
  }

  const authHeaders =
    options?.getHeaders?.() ?? runtimeConfig.getAuthHeaders?.() ?? {};

  for (const [key, value] of Object.entries(authHeaders)) {
    // No agregar Content-Type desde authHeaders si estamos enviando FormData
    if (key.toLowerCase() === "content-type" && !includeJsonContentType) {
      continue;
    }
    result.set(key, value);
  }

  // Asegurar limpieza final: eliminar Content-Type cuando enviamos FormData
  if (!includeJsonContentType) {
    result.delete("Content-Type");
  }

  return result;
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function getErrorMessage(response: Response, json: unknown): string {
  if (json && typeof json === "object") {
    const withMessage = json as { message?: unknown; Message?: unknown };
    const message = withMessage.message ?? withMessage.Message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return `Error HTTP ${response.status}: ${response.statusText}`;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(response, json));
  }

  return (json ?? null) as T;
}

async function executeRequest<T>(
  path: string,
  init: RequestInit,
  options?: HttpClientOptions,
  requestOptions?: RequestOptions,
): Promise<T> {
  const includeJsonContentType =
    requestOptions?.includeJsonContentType ?? true;

  const response = await fetch(buildUrl(path, options?.baseUrl), {
    credentials: "include",
    ...init,
    headers: buildHeaders(init.headers, options, includeJsonContentType),
  });

  return handleResponse<T>(response);
}

export async function httpRequest<T>(
  path: string,
  init: RequestInit,
  options?: HttpClientOptions,
): Promise<T> {
  const includeJsonContentType = !(init.body instanceof FormData);

  return executeRequest<T>(path, init, options, {
    includeJsonContentType,
  });
}

export async function httpGet<T>(
  path: string,
  options?: HttpClientOptions,
): Promise<T> {
  return executeRequest<T>(
    path,
    {
      method: "GET",
    },
    options,
  );
}

export async function httpPost<T>(
  path: string,
  body: unknown,
  options?: HttpClientOptions,
): Promise<T> {
  return executeRequest<T>(
    path,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    options,
  );
}

export async function httpPut<T>(
  path: string,
  body: unknown,
  options?: HttpClientOptions,
): Promise<T> {
  return executeRequest<T>(
    path,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    options,
  );
}

export async function httpPostForm<T>(
  path: string,
  body: FormData,
  options?: HttpClientOptions,
): Promise<T> {
  return executeRequest<T>(
    path,
    {
      method: "POST",
      body,
    },
    options,
    { includeJsonContentType: false },
  );
}

export async function httpPutForm<T>(
  path: string,
  body: FormData,
  options?: HttpClientOptions,
): Promise<T> {
  return executeRequest<T>(
    path,
    {
      method: "PUT",
      body,
    },
    options,
    { includeJsonContentType: false },
  );
}

export async function httpDelete<T>(
  path: string,
  options?: HttpClientOptions,
): Promise<T> {
  return executeRequest<T>(
    path,
    {
      method: "DELETE",
    },
    options,
  );
}
