import { useEffect, useState } from "react";
import { getInsurers, type Insurer,  } from "../services/insuranceCompanyService";

export function useInsurers() {
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInsurers()
      .then(setInsurers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { insurers, loading, error };
}