// hooks/useModuleDetail.ts
import { useEffect, useState } from "react";
import { getModuleDetail, type ModuleDetailResponse, } from "../services/vehicleService";

export function useModuleDetail(
  vehicleId: string,
  moduleKey: string
) {
  const [data, setData] =
    useState<ModuleDetailResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId || !moduleKey) return;
    setLoading(true);

    getModuleDetail(vehicleId, moduleKey)
      .then(setData)
      .finally(() => setLoading(false));
  }, [vehicleId, moduleKey]);

  return { data, loading };
}