import { httpGet } from "../lib/httpClient";

export interface Insurer {
  id: number;
  code: string;
  name: string;
  contactNumber: string;
}

export interface InsurersResponse {
  success: boolean;
  data: Insurer[];
}

export async function getInsurers(): Promise<Insurer[]> {
  const json = await httpGet<InsurersResponse>(
    "/insurancepolicy/dropdown/insurers",
  );
  return json.data;
}
