import { httpGet } from "../lib/httpClient";

export interface ApiWitness {
  id: number;
  name: string;
  description: string;
  recommendedAction: string;
  urlImage: string;
}

export interface ApiWitnessCategory {
  categoryId: number;
  categoryName: string;
  color: string;
  description: string;
  urlImage: string;
  witnesses: ApiWitness[];
}

export interface BrandWitnessResponse {
  vehicleBrand: string;
  categories: ApiWitnessCategory[];
}

interface ApiBrandWitnessWrapper {
  success: boolean;
  data: BrandWitnessResponse;
}

export async function fetchBrandWitnesses(plate: string): Promise<BrandWitnessResponse> {
  const response = await httpGet<ApiBrandWitnessWrapper>(`/brandwitness/module/${plate}`);
  return {
    vehicleBrand: response.data?.vehicleBrand ?? "",
    categories: response.data?.categories ?? [],
  };
}
