import { httpGet } from "../lib/httpClient";

export interface RTMResponse {
  success: boolean;
  data: {
    rtm: {
      lastReviewDate: string;
      expiredDate: string;
    };
    document: {
      documentCollectionId: number | null;
      status: string;
      color: string;
    };
  };
}

export async function getRTM(plate: string): Promise<RTMResponse> {
  return httpGet<RTMResponse>(`/rtm/module/${plate}`);
}
