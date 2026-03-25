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
    roadTax: RoadTax;
    document: RoadTaxDocument;
  };
}

export async function getRoadTax(plate: string): Promise<RoadTaxResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const response = await fetch(`${baseUrl}/roadtax/module/${plate}`);

  if (!response.ok) {
    throw new Error("Failed to fetch road tax");
  }

  return await response.json();
}