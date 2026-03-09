export interface HttpClientOptions {
  baseUrl: string;
  getHeaders?: () => Record<string, string>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function httpGet<T>(
  path: string,
  { baseUrl, getHeaders }: HttpClientOptions,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...getHeaders?.() },
  });
  return handleResponse<T>(response);
}

export async function httpPost<T>(
  path: string,
  body: unknown,
  { baseUrl, getHeaders }: HttpClientOptions,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getHeaders?.() },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function httpDelete<T>(
  path: string,
  { baseUrl, getHeaders }: HttpClientOptions,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...getHeaders?.() },
  });
  return handleResponse<T>(response);
}