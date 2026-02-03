/**
 * Tipos para el contrato de dispositivos entre el host y el micro frontend.
 * El host debe proveer una función que cumpla este contrato.
 */

/**
 * Parámetros para consultar dispositivos paginados.
 * Compatible con la API v2 de Traccar.
 */
export interface DevicesParams {
  /**
   * Número de página (1-indexed).
   * Si no se especifica, el host puede decidir el comportamiento por defecto.
   */
  page?: number;
  /**
   * Tamaño de página (cantidad de resultados por página).
   * Si no se especifica, el host debe usar un valor por defecto razonable (ej. 10).
   */
  pageSize?: number;
  /**
   * Término de búsqueda para filtrar por nombre/placa del dispositivo.
   * El host decide cómo aplicar este filtro (puede ser búsqueda parcial, exacta, etc.).
   */
  name?: string;
  /**
   * Otros parámetros opcionales que el host pueda soportar.
   * Por ejemplo: uniqueId, userId, all, excludeAttributes, etc.
   */
  [key: string]: unknown;
}

/**
 * Metadatos de paginación devueltos por la API.
 * Compatible con la estructura de respuesta de Traccar API v2.
 */
export interface DevicesMeta {
  /**
   * Total de páginas disponibles.
   */
  totalPages?: number;
  /**
   * Total de elementos disponibles (sin paginación).
   */
  total?: number;
  /**
   * Página actual (1-indexed).
   */
  page?: number;
  /**
   * Tamaño de página usado.
   */
  pageSize?: number;
  /**
   * Otros metadatos que el host pueda incluir.
   */
  [key: string]: unknown;
}

/**
 * Dispositivo tal como lo devuelve el host (Traccar o cualquier otra fuente).
 * El micro frontend no asume una estructura específica, pero espera al menos
 * campos básicos que puedan mapearse a Vehicle.
 */
export interface Device {
  /**
   * Identificador único del dispositivo.
   */
  id: number | string;
  /**
   * Nombre del dispositivo (en el dominio de negocio, esto es la "placa").
   */
  name: string;
  /**
   * Unique ID del dispositivo (puede ser el mismo que id o diferente).
   */
  uniqueId?: string;
  /**
   * Otros campos que el host pueda incluir (model, phone, contact, attributes, etc.).
   */
  [key: string]: unknown;
}

/**
 * Respuesta esperada de la función fetchDevices inyectada por el host.
 * Compatible con la estructura de respuesta de Traccar API v2: { data: [], meta: {} }
 */
export interface DevicesResponse {
  /**
   * Array de dispositivos devueltos para la página solicitada.
   */
  data: Device[];
  /**
   * Metadatos de paginación y otros metadatos relevantes.
   */
  meta: DevicesMeta;
}

/**
 * Función que el host debe inyectar para que el micro frontend obtenga dispositivos.
 * Esta función debe cumplir con el contrato definido por DevicesParams y DevicesResponse.
 *
 * @param params - Parámetros de paginación y filtrado
 * @returns Promise que resuelve con la respuesta paginada de dispositivos
 */
export type FetchDevicesFunction = (
  params: DevicesParams,
) => Promise<DevicesResponse>;
