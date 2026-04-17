import { useEffect, useState } from "react";
import { getRoadTax, type RoadTax, type RoadTaxDocument } from "../services/roadTaxService";

export function useRoadTax(plate: string) {
  const [roadTax, setRoadTax] = useState<RoadTax | null>(null);
  const [document, setDocument] = useState<RoadTaxDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRoadTax(plate)
      .then((res) => {
        setRoadTax(res.data.cityPaymentInfo);
        setDocument(res.data.document);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [plate]);

  return { roadTax, document, loading, error };
}