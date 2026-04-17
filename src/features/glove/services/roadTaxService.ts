import { httpGet } from "../lib/httpClient";

export interface RoadTax {
  id: number;
  cityRegistration: string;
  discountPaymentDeadline: string;
  paymentDeadline: string;
  untimelyPayment: string;
}

export interface RoadTaxDocument {
  documentCollectionId: string | null;
  status: string;
  color: string;
  startDate: string;
  endDate: string;
}

export interface RoadTaxResponse {
  success: boolean;
  data: {
    cityPaymentInfo: RoadTax;
    document: RoadTaxDocument;
  };
}

export async function getRoadTax(plate: string): Promise<RoadTaxResponse> {
  return httpGet<RoadTaxResponse>(`/roadtax/module/${plate}`);
}
