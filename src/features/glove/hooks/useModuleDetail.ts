// hooks/useModuleDetail.ts
import { useEffect, useState } from "react";
import { getModuleDetail, type ModuleDetailResponse, } from "../services/vehicleService";

export function useModuleDetail(
  plate: string,
  moduleKey: string
) {
  const [data, setData] =
    useState<ModuleDetailResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plate || !moduleKey) return;

    setLoading(true);

    getModuleDetail(plate, moduleKey)
      .then(setData)
      .finally(() => setLoading(false));
  }, [plate, moduleKey]);

  return { data, loading };
}