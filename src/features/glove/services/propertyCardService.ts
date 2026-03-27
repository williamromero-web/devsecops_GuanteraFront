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
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8087/glove";

  const response = await fetch(`${baseUrl}/propertycard/module/${plate}`);

  if (!response.ok) {
    throw new Error("Failed to fetch RTM");
  }

  return await response.json();
}

export async function getVehicleDocumentNodes(documentCollectionId: string): Promise<VehicleDocumentNode[]> {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8087/glove";
    const response = await fetch(`${baseUrl}/vehicledocument/nodes/${documentCollectionId}`);

    if (!response.ok) {
      return [];
    }

    const json = await response.json() as { success: boolean; data?: VehicleDocumentNode[] | null };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function updatePropertyCardNumber(
  id: number,
  cardnumber: string
) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8087/glove";

  const response = await fetch(`${baseUrl}/propertycard/cardnumber/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "cardNumber": cardnumber
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update Property Card number");
  }

  return await response.json();
}