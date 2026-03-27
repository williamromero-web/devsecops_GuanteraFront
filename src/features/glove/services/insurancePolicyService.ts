export interface InsurancePolicyResponse {
  success: boolean;
  data: {
    insurancePolicy: {
      id: number;
      number: string;
      insurerName: string;
      insurerCellPhone: string;
      assistanceNumber: string;
      isEditable: boolean;
    };
    document: {
      documentCollectionId: string;
      status: string;
      color: string;
      startDate: string;
      expiredDate: string;
    };
  };
}

export type InsurancePolicyType =
  | "soat"
  | "insurance_policy"
  | "warranty_policy";

export async function getInsurancePolicy(
  type: InsurancePolicyType,
  plate: string
): Promise<InsurancePolicyResponse> {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8087/glove";

  const response = await fetch(
    `${baseUrl}/insurancepolicy/module/${type}/${plate}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch insurance policy");
  }

  return await response.json();
}