import { httpGet } from "../lib/httpClient";

/**
 * Service to fetch SOAT data from the backend
 */

export interface SoatApiResponse {
  statusType?: string;
  status?: string;
  state?: string;
  number?: string;
  numeroPoliza?: string;
  policyNumber?: string;
  policy?: string;
  expirationDate?: string;
  fechaVencimiento?: string;
  expiration?: string;
  document?: {
    name?: string;
    fileName?: string;
    size?: number;
  };
  file?: {
    name?: string;
    fileName?: string;
    size?: number;
  };
  soatFile?: {
    name?: string;
    fileName?: string;
    size?: number;
  };
  vehicleId?: number | string;
}

export interface SoatData {
  number: string;
  file: {
    name: string;
    fileName: string;
    size: number;
  } | null;
  expirationDate: string;
}

/**
 * Fetches SOAT data from the backend by license plate
 * @param plate Vehicle license plate
 * @param apiUrl API base URL opcional
 */
export async function fetchSoatData(
  plate: string,
  apiUrl?: string,
): Promise<SoatData> {
  const data = await httpGet<SoatApiResponse>(
    `/insurancepolicy/module/soat/${encodeURIComponent(plate)}`,
    { baseUrl: apiUrl },
  );

  // Flexible field mapping from API response
  const policyNumber = data.number || data.numeroPoliza || data.policyNumber || data.policy || "";
  
  const expirationRaw = data.expirationDate || data.fechaVencimiento || data.expiration;
  let expiration = "";
  if (expirationRaw) {
    const d = new Date(expirationRaw);
    expiration = isNaN(d.getTime())
      ? String(expirationRaw)
      : d.toLocaleDateString("es-PE");
  }

  const documentObj = data.document || data.file || data.soatFile;
  const fileData = documentObj ? {
    name: documentObj.name || documentObj.fileName || "soat.pdf",
    fileName: documentObj.fileName || documentObj.name || "soat.pdf",
    size: documentObj.size || 0,
  } : null;

  return {
    number: policyNumber,
    file: fileData,
    expirationDate: expiration,
  };
}
