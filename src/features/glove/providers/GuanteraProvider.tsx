import { createContext, useContext, useMemo } from "react";

export interface GuanteraConfig {
  /**
   * Identificador del usuario autenticado.
   * Fase 8 (quemado): valor mock hasta que el host lo inyecte.
   */
  userId: string | null;
  /**
   * URL base del backend de Guantera.
   * Fase 8 (quemado): opcional / mock.
   */
  baseUrl: string | null;
  /**
   * Función para construir los headers de autenticación.
   * Fase 8 (quemado): devuelve objeto vacío.
   */
  getAuthHeaders: () => Record<string, string>;
}

const DEFAULT_CONFIG: GuanteraConfig = {
  userId: "mock-user",
  baseUrl: null,
  getAuthHeaders: () => ({}),
};

const GuanteraContext = createContext<GuanteraConfig>(DEFAULT_CONFIG);

export interface GuanteraProviderProps {
  readonly children: React.ReactNode;
  readonly value?: Partial<GuanteraConfig>;
}

/**
 * Provider "quemado" para Fase 8.
 * En integración real, TraccarWeb (u otro host) inyectará `userId`,
 * `baseUrl` y `getAuthHeaders`. Mientras tanto, usa valores mock.
 */
export function GuanteraProvider({
  children,
  value,
}: Readonly<GuanteraProviderProps>) {
  const merged: GuanteraConfig = useMemo(
    () => ({
      userId: value?.userId ?? DEFAULT_CONFIG.userId,
      baseUrl: value?.baseUrl ?? DEFAULT_CONFIG.baseUrl,
      getAuthHeaders: value?.getAuthHeaders ?? DEFAULT_CONFIG.getAuthHeaders,
    }),
    [value?.userId, value?.baseUrl, value?.getAuthHeaders],
  );

  return (
    <GuanteraContext.Provider value={merged}>
      {children}
    </GuanteraContext.Provider>
  );
}

export function useGuanteraConfig(): GuanteraConfig {
  return useContext(GuanteraContext);
}

