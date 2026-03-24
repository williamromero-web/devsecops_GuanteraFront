import { useEffect, useState } from "react";
import { fetchMunicipalities, type Municipality } from "../services/pypService";

export interface UseMunicipalitiesState {
  municipalities: Municipality[];
  isLoading: boolean;
  error: string | null;
}

export function useMunicipalities(): UseMunicipalitiesState {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMunicipalities();
        setMunicipalities(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "No se pudo obtener los municipios.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  return { municipalities, isLoading, error };
}