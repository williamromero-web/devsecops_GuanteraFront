import { httpGet, httpPostForm } from "../lib/httpClient";

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
  return `${String(date.getUTCDate()).padStart(2, "0")}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}-${date.getUTCFullYear()}`;
}

/**
 * Formatea una fecha string (ISO u otro) a DD-MM-YYYY si es posible
 * Usa parsing manual para evitar problemas de timezone cuando el input es YYYY-MM-DD
 */
export function formatToDD_MM_YYYY(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  // Parse manually to avoid timezone issues with ISO strings like "2016-07-15"
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return formatDateToDD_MM_YYYY(date);
}

export interface UploadDocumentResponse {
  success: boolean;
  data: string[];
}

/**
 * Carga un documento en el endpoint POST /vehicledocument/upload
 * @param params Parámetros del documento
 * @param apiUrl URL base del API (se resuelve via cliente central)
 * @throws Error si falla la carga
 */
export async function uploadDocument(
  params: DocumentUploadParams
): Promise<string | null> {
  const { documentTypeId, vehicleId, file, startDate, expiredDate, metadata, collectionId } = params;

  const formData = new FormData();

  // Campos obligatorios
  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));
  formData.append("documents[0].fileFront", file);
  formData.append("documents[0].startDate", startDate);
  formData.append("documents[0].expiredDate", expiredDate);
  if (collectionId) formData.append("collectionId", collectionId);

  // Agregar metadata si se proporciona
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`documents[0].metaData${key}`, String(value));
      }
    });
  }

  const json = await httpPostForm<UploadDocumentResponse>(
    "/vehicledocument/upload",
    formData,
  );
  return (json.success && json.data?.[0]) ? json.data[0] : null;
}

export interface PolicyDocumentUploadParams {
  documentTypeId: number | string;
  vehicleId: number | string;
  frontFile?: File;
  backFile?: File;
  // startDate?: string;
  expiredDate?: string;
  collectionId?: string;
  metadata?: Record<string, string | number | null | undefined>;
}

export async function uploadPolicyDocument(
  params: PolicyDocumentUploadParams,
): Promise<void> {
  const { documentTypeId, vehicleId, frontFile, backFile, expiredDate, collectionId, metadata } = params;
  console.log(expiredDate);
  
  const formData = new FormData();

  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));
  if (collectionId) formData.append("collectionId", collectionId);
  if (frontFile) formData.append("documents[0].fileFront", frontFile);
  if (backFile) formData.append("documents[0].fileReverse", backFile);
  // formData.append("documents[0].startDate", startDate ?? "");
  formData.append("documents[0].expiredDate", expiredDate ?? "");

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`documents[0].metaData${key}`, String(value));
      }
    });
  }

  await httpPostForm<unknown>("/vehicledocument/upload", formData);
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
  const { documentTypeId, vehicleId, frontFile, backFile, startDate, expiredDate, collectionId, metadata } = params;

  const formData = new FormData();

  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));
  if (collectionId) formData.append("collectionId", collectionId);
  if (frontFile) formData.append("documents[0].fileFront", frontFile);
  if (backFile) formData.append("documents[0].fileReverse", backFile);
  formData.append("documents[0].startDate", startDate ?? "");
  formData.append("documents[0].expiredDate", expiredDate ?? "");

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`documents[0].metaData${key}`, String(value));
      }
    });
  }

  await httpPostForm<unknown>("/vehicledocument/upload", formData);
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

  await httpPostForm<unknown>("/vehicledocument/upload", formData);
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
  return httpGet<DocumentTypeApiResponse>(`/vehicledocument/documenttype/${code}`);
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
  return httpGet<ApiVehicleDocumentInfoResponse>(`/vehicledocument/info/${vehicleId}/${documentTypeId}`);
}

export interface OtroDocumentoItem {
  id?: number;
  otherDocumentId?: number | null;
  collectionId?: string;
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
  const { documentTypeId, vehicleId, documents } = params;

  const formData = new FormData();
  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));
  formData.append("documentCount", String(documents.length));

  documents.forEach((doc, i) => {
    console.log("doc.otherDocumentId:", doc.otherDocumentId);
    
    if (doc.files[0]) formData.append(`documents[${i}].fileFront`, doc.files[0]);
    if (doc.files[1]) formData.append(`documents[${i}].fileReverse`, doc.files[1]);
    if (doc.collectionId ) formData.append(`documents[${i}].metaDataCollectionID`, doc.collectionId);
    if (doc.otherDocumentId !== undefined && doc.otherDocumentId !== null && doc.otherDocumentId !== 0) {
      formData.append(`documents[${i}].metaDataID`, String(doc.otherDocumentId));
    }
    formData.append(`documents[${i}].metaDataName`, doc.name);
    formData.append(`documents[${i}].metaDataEntity`, doc.entity);
    formData.append(`documents[${i}].startDate`, doc.startDate);
    if (doc.expiredDate) {
      formData.append(`documents[${i}].expiredDate`, doc.expiredDate);
    }
    if (doc.description) {
      formData.append(`documents[${i}].metaDataDescription`, doc.description);
    }
  });

  await httpPostForm<unknown>("/vehicledocument/upload", formData);
}
