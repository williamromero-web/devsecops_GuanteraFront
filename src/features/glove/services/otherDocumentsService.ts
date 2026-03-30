import { httpGet } from "../lib/httpClient";

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
  return httpGet<OtherDocumentsResponse>(`/otherdocument/module/${plate}`);
}
