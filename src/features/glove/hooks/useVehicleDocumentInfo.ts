import { useEffect, useState } from "react";
import { fetchVehicleDocumentInfo, type ApiVehicleDocumentInfo } from "../services/documentUpload";

export interface UseVehicleDocumentInfoResult {
  data: ApiVehicleDocumentInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVehicleDocumentInfo(
  vehicleId: string | number,
  documentTypeId: string | number,
): UseVehicleDocumentInfoResult {
  const [data, setData] = useState<ApiVehicleDocumentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!vehicleId || !documentTypeId) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchVehicleDocumentInfo(vehicleId, documentTypeId);
        setData(res.success ? res.data : null);
      } catch (err: unknown) {
        setData(null);
        setError(
          err instanceof Error ? err.message : "Error al obtener el documento.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [vehicleId, documentTypeId, tick]);

  return {
    data,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}