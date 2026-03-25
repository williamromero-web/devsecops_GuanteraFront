import { useEffect, useState } from "react";
import { fetchPypCalendar, type PypCalendarData } from "../services/pypService";

export interface UsePypCalendarState {
  data: PypCalendarData | null;
  isLoading: boolean;
  error: string | null;
}

export function usePypCalendar(plate: string, municipalityCode?: string): UsePypCalendarState {
  const [data, setData] = useState<PypCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plate) return;

    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchPypCalendar(plate, municipalityCode);
        if (mounted) setData(result);
      } catch (err: unknown) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "No se pudo obtener el calendario de Pico y Placa."
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [plate, municipalityCode]);

  return { data, isLoading, error };
}