import { useEffect, useState } from "react";
import { getInsurancePolicy, type InsurancePolicyType } from "../services/insurancePolicyService";

export function useInsurancePolicy(type: InsurancePolicyType, plate: string) {

  const [policy, setPolicy] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    async function loadPolicy() {
      try {
        setLoading(true);

        const response = await getInsurancePolicy(type, plate);

        setPolicy(response.data.insurancePolicy);
        setDocument(response.data.document);

      } catch (err) {
        setError("No se pudo cargar la póliza.");
      } finally {
        setLoading(false);
      }
    }

    loadPolicy();
  }, [type, plate, tick]);

  return { policy, document, loading, error, refetch: () => setTick((t) => t + 1) };
}