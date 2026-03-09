export const DocumentTypeCode = {
  TC: "TC",
  RT: "RT",
  ST: "ST",
  PS: "PS",
  PG: "PG",
  OT: "OT",
  RTM: "RTM",
  FA: "FA",
  MV: "MV",
  GM: "GM",
  LC: "LC",
  DI: "DI",
} as const;

export type DocumentTypeCode = typeof DocumentTypeCode[keyof typeof DocumentTypeCode];

export interface DocumentType {
  id: number;
  code: DocumentTypeCode;
  label: string;
}

export const DOCUMENT_TYPES: readonly DocumentType[] = [
  { id: 1,  code: DocumentTypeCode.TC,  label: "Tarjeta Propiedad" },
  { id: 2,  code: DocumentTypeCode.RT,  label: "Impuesto Vehicular" },
  { id: 3,  code: DocumentTypeCode.ST,  label: "SOAT" },
  { id: 4,  code: DocumentTypeCode.PS,  label: "Poliza de seguro" },
  { id: 5,  code: DocumentTypeCode.PG,  label: "Poliza de garantias" },
  { id: 6,  code: DocumentTypeCode.OT,  label: "Otros Documentos" },
  { id: 7,  code: DocumentTypeCode.RTM, label: "Revision Tecnomecanica" },
  { id: 8,  code: DocumentTypeCode.FA,  label: "Factura" },
  { id: 9,  code: DocumentTypeCode.MV,  label: "Manual del Vehiculo" },
  { id: 10, code: DocumentTypeCode.GM,  label: "Guia de Control de Mantenimiento" },
  { id: 11, code: DocumentTypeCode.LC,  label: "Licencia de Conduccion" },
  { id: 12, code: DocumentTypeCode.DI,  label: "Declaracion de Importacion" },
] as const;