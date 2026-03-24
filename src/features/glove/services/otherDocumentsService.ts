export interface OtherDocumentItem {
  otherDocument: {
    id: number;
    name: string;
    entity: string;
    description: string;
  };
  document: {
    id: number;
    documentCollectionId: string;
    status: string;
    color: string;
    startDate: string;
    endDate: string;
  };
}

export interface OtherDocumentsResponse {
  success: boolean;
  data: OtherDocumentItem[];
}

export async function getOtherDocuments(plate: string): Promise<OtherDocumentsResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const response = await fetch(`${baseUrl}/otherdocument/module/${plate}`);

  if (!response.ok) {
    throw new Error("Failed to fetch other documents");
  }

  return response.json();
}
