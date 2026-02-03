import { createContext, useContext, useMemo } from "react";
import type { FetchDevicesFunction } from "../types/devices";

export interface DevicesApiConfig {
  defaultPageSize?: number;
  searchParamName?: string;
}

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
  /**
   * Función inyectada por el host (TraccarWeb) para obtener dispositivos paginados.
   * Si no se proporciona, Glove usa datos mock (modo standalone).
   */
  fetchDevices: FetchDevicesFunction | null;
  /**
   * Configuración de la API de dispositivos (paginación y nombre del parámetro de búsqueda).
   */
  devicesApiConfig: DevicesApiConfig | null;
}

const DEFAULT_CONFIG: GuanteraConfig = {
  userId: "mock-user",
  baseUrl: null,
  getAuthHeaders: () => ({}),
  fetchDevices: null,
  devicesApiConfig: null,
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
      fetchDevices: value?.fetchDevices ?? DEFAULT_CONFIG.fetchDevices,
      devicesApiConfig: value?.devicesApiConfig ?? DEFAULT_CONFIG.devicesApiConfig,
    }),
    [
      value?.userId,
      value?.baseUrl,
      value?.getAuthHeaders,
      value?.fetchDevices,
      value?.devicesApiConfig,
    ],
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

