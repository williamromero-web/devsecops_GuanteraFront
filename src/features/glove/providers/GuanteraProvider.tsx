import { createContext, useContext, useMemo } from "react";
import type { FetchDevicesFunction } from "../types/devices";

export interface DevicesApiConfig {
  defaultPageSize?: number;
  searchParamName?: string;
}

export interface GuanteraConfig {
  userId: string | null;

  baseUrl: string | null;

  getAuthHeaders: () => Record<string, string>;

  fetchDevices: FetchDevicesFunction | null;

  devicesApiConfig: DevicesApiConfig | null;

  userProfile: {
    licenseNumber: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
  } | null;
}

const DEFAULT_CONFIG: GuanteraConfig = {
  userId: "mock-user",
  baseUrl: null,
  getAuthHeaders: () => ({}),
  fetchDevices: null,
  devicesApiConfig: null,
  userProfile: null,
};

const GuanteraContext = createContext<GuanteraConfig>(DEFAULT_CONFIG);

export interface GuanteraProviderProps {
  readonly children: React.ReactNode;
  readonly value?: Partial<GuanteraConfig>;
}

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
      devicesApiConfig:
        value?.devicesApiConfig ?? DEFAULT_CONFIG.devicesApiConfig,
      userProfile: value?.userProfile ?? DEFAULT_CONFIG.userProfile,
    }),
    [
      value?.userId,
      value?.baseUrl,
      value?.getAuthHeaders,
      value?.fetchDevices,
      value?.devicesApiConfig,
      value?.userProfile,
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
