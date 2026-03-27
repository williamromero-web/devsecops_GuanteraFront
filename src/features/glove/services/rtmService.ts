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
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8087/glove";

  const response = await fetch(`${baseUrl}/rtm/module/${plate}`);

  if (!response.ok) {
    throw new Error("Failed to fetch RTM");
  }

  return await response.json();
}