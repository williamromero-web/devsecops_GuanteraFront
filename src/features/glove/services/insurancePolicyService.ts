import { httpGet } from "../lib/httpClient";

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
  return httpGet<InsurancePolicyResponse>(
    `/insurancepolicy/module/${type}/${plate}`,
  );
}
