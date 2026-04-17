import { useEffect, useState } from "react";
import { fetchBrandWitnesses, type ApiWitnessCategory } from "../services/brandWitnessService";

export interface UseBrandWitnessesState {
  categories: ApiWitnessCategory[];
  vehicleBrand: string;
  isLoading: boolean;
  error: string | null;
}

export function useBrandWitnesses(plate: string): UseBrandWitnessesState {
  const [categories, setCategories] = useState<ApiWitnessCategory[]>([]);
  const [vehicleBrand, setVehicleBrand] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plate) return;

    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchBrandWitnesses(plate);
        setCategories(data.categories ?? []);
        setVehicleBrand(data.vehicleBrand ?? "");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "";
        if (message.toLowerCase().includes("not found")) {
          setError("Vehículo no encontrado");
        } else {
          setError("No fue posible cargar los testigos. Intenta nuevamente.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [plate]);

  return { categories, vehicleBrand, isLoading, error };
}
