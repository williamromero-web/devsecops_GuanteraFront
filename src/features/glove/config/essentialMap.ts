import type { ModuleKey } from "./optionsConfig";

/**
 * Mapea nombres  hacia el módulo correspondiente.
 */
export const ESSENTIAL_MODULE_MAP: Record<ModuleKey, string[]> = {
  propiedad: [
    "impuesto vehicular",
    "impuesto",
    "tarjeta de propiedad",
    "tarjeta propiedad",
    "factura",
    "declaración de importación",
    "declaracion de importacion",
  ],
  seguros: [
    "soat",
    "póliza de seguro",
    "poliza de seguro",
    "póliza de garantía",
    "poliza de garantia",
    "asistencias viales",
    "seguro",
    "seguros",
  ],
  mantenimiento: [
    "revisión técnico-mecánica",
    "revision tecnico-mecanica",
    "revisión técnico mecánica",
    "revision tecnico mecanica",
    "tecnico-mecánica",
    "tecnico-mecanica",
    "técnico-mecánica",
    "técnico-mecanica",
    "guía de control de mantenimiento",
    "guia de control de mantenimiento",
    "mantenimiento",
  ],
  operacion: [
    "pico y placa",
    "picoyplaca",
    "licencia de conducción",
    "licencia de conduccion",
    "kit de carretera",
    "botiquín",
    "botiquin",
    "testigos",
    "operación",
    "operacion",
  ],
};
