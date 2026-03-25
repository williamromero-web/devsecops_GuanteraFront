/**
 * Hook to load and manage SOAT data
 */

import { useEffect, useState } from "react";
import { fetchSoatData, type SoatData } from "../services/soatService";

export interface UseSoatState extends SoatData {
  loading: boolean;
  error: string | null;
}

export function useSoat(plate: string): UseSoatState {
  const [number, setNumber] = useState<string>("");
  const [file, setFile] = useState<SoatData["file"]>(null);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadSoat = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSoatData(plate);

        setNumber(data.number);
        setFile(data.file);
        setExpirationDate(data.expirationDate);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Could not load SOAT data.");
      } finally {
        setLoading(false);
      }
    };

    loadSoat();

    return () => controller.abort();
  }, [plate]);

  return {
    number,
    file,
    expirationDate,
    loading,
    error,
  };
}
