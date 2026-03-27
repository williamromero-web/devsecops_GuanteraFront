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
  const baseUrl = apiUrl || import.meta.env.VITE_API_BASE_URL || "http://localhost:8087/glove";
  const url = `${baseUrl}/vehicle/modules`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch modules: HTTP ${response.status}`);
    }

    const result = await response.json();
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
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8087/glove";
  const url = `${baseUrl}/vehicledocument/${vehicleId}/modules/${moduleKey}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch module detail: HTTP ${response.status}`);
    }

    const json = await response.json();
    
    return json.data;
  } catch (error) {
    console.error("Error fetching module detail:", error);
    throw error;
  }
  
}