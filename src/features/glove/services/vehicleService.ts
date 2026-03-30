import { httpGet, httpPost } from "../lib/httpClient";

export interface ApiModuleResponse {
  module: string;
  color: string;
}

export interface ApiVehicleStatus {
  vehicleId: number;
  plate: string;
  modules: ApiModuleResponse[];
}

export interface VehicleStatus {
  vehicleId: number;
  plate: string;
  modules: {
    name: string;
    color: string;
  }[];
}

export interface ModuleDetailItem {
  optionKey: string;
  status: "active" | "warning" | "expired";
  color: string;
  expirationDate?: string;
}

export interface ModuleDetailResponse {
  module: string;
  items: ModuleDetailItem[];
}

export async function fetchVehiclesModules(
  plates: string[],
  apiUrl?: string
): Promise<VehicleStatus[]> {
  try {
    const result = await httpPost<{ data?: ApiVehicleStatus[] }>(
      "/vehicle/modules",
      plates,
      { baseUrl: apiUrl },
    );
    const data: ApiVehicleStatus[] = result.data || [];

    return data.map((item) => ({
      vehicleId: item.vehicleId,
      plate: item.plate,
      modules: (item.modules || []).map((m) => ({
        name: m.module,
        color: m.color || "#9CA3AF",
      })),
    }));
  } catch (error) {
    console.error("Error fetching vehicle modules:", error);
    throw error;
  }
}

export async function getModuleDetail(
  vehicleId: string,
  moduleKey: string
): Promise<ModuleDetailResponse> {
  try {
    const json = await httpGet<{ data: ModuleDetailResponse }>(
      `/vehicledocument/${vehicleId}/modules/${moduleKey}`,
    );
    
    return json.data;
  } catch (error) {
    console.error("Error fetching module detail:", error);
    throw error;
  }
  
}
