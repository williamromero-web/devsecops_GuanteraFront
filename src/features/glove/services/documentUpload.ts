import { httpGet } from "../lib/httpClient";

/**
 * Servicio para cargar documentos de vehículos.
 * Endpoint genérico usado por múltiples módulos (SOAT, Seguros, etc.)
 */

export interface DocumentUploadParams {
  /**
   * ID del tipo de documento (ej: 3 para SOAT)
   */
  documentTypeId: number | string;

  /**
   * ID del vehículo a asociar el documento
   */
  vehicleId: number | string;

  /**
   * Archivo a cargar
   */
  file: File;

  /**
   * Fecha de inicio en formato DD-MM-YYYY
   */
  startDate: string;

  /**
   * Fecha de vencimiento en formato DD-MM-YYYY
   */
  expiredDate: string;

  /**
   * Metadata flexible según el tipo de documento
   * Ej: { policyTypeID: 1, policyNumber: "123456", insurerID: 3 }
   */
  metadata?: Record<string, string | number | null | undefined>;

  /** ID de la colección existente al que se agregará el archivo. */
  collectionId?: string;
}

/**
 * Formatea una fecha a formato DD-MM-YYYY
 */
export function formatDateToDD_MM_YYYY(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${date.getFullYear()}`;
}

/**
 * Formatea una fecha string (ISO u otro) a DD-MM-YYYY si es posible
 */
export function formatToDD_MM_YYYY(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Retorna como está si no se puede parsear
  return formatDateToDD_MM_YYYY(date);
}

export interface UploadDocumentResponse {
  success: boolean;
  data: string[];
}

/**
 * Carga un documento en el endpoint POST /vehicledocument/upload
 * @param params Parámetros del documento
 * @param apiUrl URL base del API (default: VITE_API_BASE_URL o http://localhost:8080)
 * @throws Error si falla la carga
 */
export async function uploadDocument(
  params: DocumentUploadParams
): Promise<string | null> {
  const baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

  const { documentTypeId, vehicleId, file, startDate, expiredDate, metadata, collectionId } = params;

  const formData = new FormData();

  // Campos obligatorios
  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));
  formData.append("documents[0].fileFront", file);
  formData.append("startDate", startDate);
  formData.append("expiredDate", expiredDate);
  if (collectionId) formData.append("collectionId", collectionId);

  // Agregar metadata si se proporciona
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`metaData${key}`, String(value));
      }
    });
  }

  const url = new URL("/vehicledocument/upload", baseUrl).toString();

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Upload failed with status ${response.status}: ${response.statusText}`,
    );
  }

  const json = await response.json() as UploadDocumentResponse;
  return (json.success && json.data?.[0]) ? json.data[0] : null;
}

export interface PropertyCardDocumentUploadParams {
  documentTypeId: number | string;
  vehicleId: number | string;
  frontFile?: File;
  backFile?: File;
  startDate?: string;
  expiredDate?: string;
  collectionId?: string;
  metadata?: Record<string, string | number | null | undefined>;
}

export async function uploadPropertyCardDocuments(
  params: PropertyCardDocumentUploadParams,
): Promise<void> {
  const baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

  const { documentTypeId, vehicleId, frontFile, backFile, startDate, expiredDate, collectionId, metadata } = params;

  const formData = new FormData();

  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));
  if (collectionId) formData.append("collectionId", collectionId);
  if (frontFile) formData.append("documents[0].fileFront", frontFile);
  if (backFile) formData.append("documents[0].fileReverse", backFile);
  formData.append("startDate", startDate ?? "");
  formData.append("expiredDate", expiredDate ?? "");

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`metaData${key}`, String(value));
      }
    });
  }

  const url = new URL("/vehicledocument/upload", baseUrl).toString();

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Upload failed with status ${response.status}: ${response.statusText}`,
    );
  }
}

export interface MultipleDocumentUploadParams {
  documentTypeId: number | string;
  vehicleId: number | string;
  files: File[];
  startDate: string;
  expiredDate: string;
  metadata?: Record<string, string | number | null | undefined>;
}

export async function uploadMultipleDocuments(
  params: MultipleDocumentUploadParams,
): Promise<void> {
  const baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

  const { documentTypeId, vehicleId, files, startDate, expiredDate, metadata } = params;

  const formData = new FormData();

  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));

  files.forEach((file, index) => {
    formData.append(`documents[${index}].fileFront`, file);
  });

  formData.append("startDate", startDate);
  formData.append("expiredDate", expiredDate);

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`metaData${key}`, String(value));
      }
    });
  }

  const url = new URL("/vehicledocument/upload", baseUrl).toString();

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Upload failed with status ${response.status}: ${response.statusText}`,
    );
  }
}

export interface DocumentTypeApiResponse {
  success: boolean;
  data: {
    id: number;
    code: string;
    name: string;
  };
}

export async function getDocumentTypeByCode(code: string): Promise<DocumentTypeApiResponse> {
  const baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
  return httpGet<DocumentTypeApiResponse>(`/vehicledocument/documenttype/${code}`, { baseUrl });
}

export interface ApiVehicleDocumentInfo {
  id: number;
  vehicleId: number;
  documentTypeId: number;
  documentCollectionId: string;
  startDate: string;
  expiredDate: string;
  documentStatusId: number;
}

export interface ApiVehicleDocumentInfoResponse {
  success: boolean;
  data: ApiVehicleDocumentInfo;
}

export async function fetchVehicleDocumentInfo(
  vehicleId: string | number,
  documentTypeId: string | number,
): Promise<ApiVehicleDocumentInfoResponse> {
  const baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
  return httpGet<ApiVehicleDocumentInfoResponse>(
    `/vehicledocument/info/${vehicleId}/${documentTypeId}`,
    { baseUrl },
  );
}

export interface OtroDocumentoItem {
  files: File[];
  name: string;
  entity: string;
  startDate: string;
  expiredDate?: string;
  description?: string;
}

export interface OtrosDocumentosUploadParams {
  documentTypeId: number | string;
  vehicleId: number | string;
  documents: OtroDocumentoItem[];
}

export async function uploadOtrosDocumentos(
  params: OtrosDocumentosUploadParams,
): Promise<void> {
  const baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

  const { documentTypeId, vehicleId, documents } = params;

  const formData = new FormData();
  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));

  documents.forEach((doc, i) => {
    if (doc.files[0]) formData.append(`documents[${i}].fileFront`, doc.files[0]);
    if (doc.files[1]) formData.append(`documents[${i}].fileReverse`, doc.files[1]);
    formData.append(`documents[${i}].metaDataname`, doc.name);
    formData.append(`documents[${i}].metaDataentity`, doc.entity);
    formData.append(`documents[${i}].startDate`, doc.startDate);
    if (doc.expiredDate) {
      formData.append(`documents[${i}].expiredDate`, doc.expiredDate);
    }
    if (doc.description) {
      formData.append(`documents[${i}].metaDatadescription`, doc.description);
    }
  });

  const url = new URL("/vehicledocument/upload", baseUrl).toString();

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Upload failed with status ${response.status}: ${response.statusText}`,
    );
  }
}