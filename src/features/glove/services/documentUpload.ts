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

/**
 * Carga un documento en el endpoint POST /vehicledocument/upload
 * @param params Parámetros del documento
 * @param apiUrl URL base del API (default: VITE_API_BASE_URL o http://localhost:8080)
 * @throws Error si falla la carga
 */
export async function uploadDocument(
  params: DocumentUploadParams
): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  const { documentTypeId, vehicleId, file, startDate, expiredDate, metadata } = params;

  const formData = new FormData();

  // Campos obligatorios
  formData.append("documentTypeId", String(documentTypeId));
  formData.append("vehicleId", String(vehicleId));
  formData.append("file", file);
  formData.append("startDate", startDate);
  formData.append("expiredDate", expiredDate);

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
}

/**
 * Hook para cargar documentos con manejo de carga y errores
 * No implementado aquí pero puede ser agregado posteriormente
 */
