export function decodeJwt<T = Record<string, unknown>>(token: string): T {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Token is not a valid JWT");
  }

  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );

  return JSON.parse(jsonPayload) as T;
}

export function getLicenseNumberFromToken(token: string): string | undefined {
  try {
    const payload = decodeJwt<{
      licenseNumber?: string;
      firstName?: string;
      lastName?: string;
    }>(token);
    return payload.licenseNumber;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return undefined;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem("authToken");
}

export function getStoredLicenseNumber(): string | undefined {
  const token = getStoredToken();
  if (!token) return undefined;
  return getLicenseNumberFromToken(token);
}
