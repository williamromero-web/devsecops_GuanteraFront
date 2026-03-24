import { useEffect, useState } from "react";
import { getOtherDocuments, type OtherDocumentItem } from "../services/otherDocumentsService";

export function useOtherDocuments(plate: string) {
  const [documents, setDocuments] = useState<OtherDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        setError(null);

        const response = await getOtherDocuments(plate);
        setDocuments(response.data);
      } catch (err) {
        setError("No se pudieron cargar los otros documentos.");
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [plate, tick]);

  return { documents, loading, error, refetch: () => setTick((t) => t + 1) };
}
