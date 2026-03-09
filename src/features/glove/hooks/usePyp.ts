import { useEffect, useState } from "react";
import { fetchPypData, type PypData } from "../services/pypService";

export interface UsePypState {
  data: PypData | null;
  isLoading: boolean;
  error: string | null;
}

export function usePyp(plate: string, municipalityCode?: string): UsePypState {
  const [data, setData] = useState<PypData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plate) return;

    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchPypData(plate, municipalityCode);
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "No se pudo obtener el Pico y Placa.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [plate, municipalityCode]);

  return { data, isLoading, error };
}