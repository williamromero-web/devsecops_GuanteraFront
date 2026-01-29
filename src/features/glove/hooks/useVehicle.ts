import { useEffect, useState, useCallback } from "react";
import type { Vehicle } from "../types/domain";
import { getMockVehicleByPlate } from "../lib/mockData";

export interface UseVehicleResult {
  vehicle: Vehicle | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook de Fase 8 (maquetado) para obtener un vehículo por placa.
 * Actualmente usa exclusivamente datos mock (`getMockVehicleByPlate`),
 * pero ya expone la forma esperada para cuando se conecte al backend.
 */
export function useVehicle(plate?: string | null): UseVehicleResult {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(
    (currentPlate?: string | null) => {
      if (!currentPlate) {
        setVehicle(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      // Mock: simulamos async, pero los datos vienen de `mockData`.
      setTimeout(() => {
        try {
          const v = getMockVehicleByPlate(currentPlate);
          setVehicle(v);
          setLoading(false);
        } catch (e) {
          setError(e instanceof Error ? e : new Error("Unknown error"));
          setLoading(false);
        }
      }, 0);
    },
    [],
  );

  useEffect(() => {
    load(plate);
  }, [load, plate]);

  const refetch = useCallback(() => {
    load(plate);
  }, [load, plate]);

  return { vehicle, loading, error, refetch };
}

