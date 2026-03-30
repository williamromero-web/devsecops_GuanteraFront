import { httpGet, httpPut } from "../lib/httpClient";

export interface PropertyCardResponse {
  success: boolean;
  data: {
    propertyCard: {
      id: number;
      cardNumber: string;
      cityRegistrationVeh: string;
      service: string;
      vehTypeName: string;
    };
    document: {
      documentCollectionId: string | null;
      status: string;
      color: string;
    };
  };
}

export interface VehicleDocumentNode {
  nodeId: string;
  name: string;
  extension: string;
}

export async function getPropertyCard(plate: string): Promise<PropertyCardResponse> {
  return httpGet<PropertyCardResponse>(`/propertycard/module/${plate}`);
}

export async function getVehicleDocumentNodes(documentCollectionId: string): Promise<VehicleDocumentNode[]> {
  try {
    const json = await httpGet<{ success: boolean; data?: VehicleDocumentNode[] | null }>(
      `/vehicledocument/nodes/${documentCollectionId}`,
    );
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function updatePropertyCardNumber(
  id: number,
  cardnumber: string
) {
  return httpPut(`/propertycard/cardnumber/${id}`, {
    cardNumber: cardnumber,
  });
}
