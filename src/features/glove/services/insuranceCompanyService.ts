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
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const response = await fetch(`${baseUrl}/insurancepolicy/dropdown/insurers`);

  if (!response.ok) {
    throw new Error("Failed to fetch insurers");
  }

  const json: InsurersResponse = await response.json();
  return json.data;
}