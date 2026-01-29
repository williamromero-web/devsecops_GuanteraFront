import type { OptionConfigItem } from "../types/domain";

export type ModuleKey = "propiedad" | "seguros" | "mantenimiento" | "operacion";

export const MODULE_LABELS: Record<ModuleKey, string> = {
  propiedad: "Propiedad",
  seguros: "Seguros",
  mantenimiento: "Mantenimiento",
  operacion: "Operación",
};

export const MODULES: Array<{ key: ModuleKey; label: string }> = [
  { key: "propiedad", label: MODULE_LABELS.propiedad },
  { key: "seguros", label: MODULE_LABELS.seguros },
  { key: "mantenimiento", label: MODULE_LABELS.mantenimiento },
  { key: "operacion", label: MODULE_LABELS.operacion },
];

/**
 * Config central de opciones por módulo.
 */
export const OPTIONS_CONFIG: Record<ModuleKey, OptionConfigItem[]> = {
  propiedad: [
    {
      key: "tarjeta-propiedad",
      label: "Tarjeta de propiedad",
      essentialNames: ["tarjeta de propiedad", "tarjeta propiedad"],
    },
    {
      key: "impuesto-vehicular",
      label: "Impuesto vehicular",
      essentialNames: ["impuesto vehicular", "impuesto"],
    },
    { key: "factura", label: "Factura", essentialNames: ["factura"] },
    {
      key: "declaracion-importacion",
      label: "Declaración de importación",
      essentialNames: [
        "declaración de importación",
        "declaracion de importacion",
      ],
    },
    {
      key: "manual-vehiculo",
      label: "Manual del vehículo",
      essentialNames: [],
    },
    { key: "otros-documentos", label: "Otros documentos", essentialNames: [] },
  ],
  seguros: [
    { key: "soat", label: "SOAT", essentialNames: ["soat"] },
    {
      key: "poliza-seguro",
      label: "Póliza de seguro",
      essentialNames: ["póliza de seguro", "poliza de seguro"],
    },
    {
      key: "asistencias-viales",
      label: "Asistencias viales",
      essentialNames: ["asistencias viales"],
    },
    {
      key: "poliza-garantia",
      label: "Póliza de garantía",
      essentialNames: ["póliza de garantía", "poliza de garantia"],
    },
  ],
  mantenimiento: [
    {
      key: "revision-tecnico-mecanica",
      label: "Revisión técnico-mecánica",
      essentialNames: [
        "revisión técnico-mecánica",
        "revision tecnico-mecanica",
        "revisión técnico mecánica",
        "revision tecnico mecanica",
        "tecnico-mecánica",
        "tecnico-mecanica",
        "técnico-mecánica",
        "técnico-mecanica",
      ],
    },
    {
      key: "guia-control-mantenimiento",
      label: "Guía de Control de Mantenimiento",
      essentialNames: [
        "guía de control de mantenimiento",
        "guia de control de mantenimiento",
      ],
    },
  ],
  operacion: [
    {
      key: "licencia-conduccion",
      label: "Licencia de conducción",
      disabled: true,
      essentialNames: ["licencia de conducción", "licencia de conduccion"],
    },
    {
      key: "pico-y-placa",
      label: "Pico y placa",
      essentialNames: ["pico y placa", "picoyplaca"],
    },
    {
      key: "kit-carretera",
      label: "Kit de carretera",
      essentialNames: ["kit de carretera"],
    },
    {
      key: "botiquin",
      label: "Botiquín",
      essentialNames: ["botiquín", "botiquin"],
    },
    {
      key: "testigos",
      label: "Testigos",
      disabled: true,
      maintenance: true,
      essentialNames: [],
    },
  ],
};

export function findOption(moduleKey: ModuleKey, optionKey: string) {
  return OPTIONS_CONFIG[moduleKey]?.find((o) => o.key === optionKey);
}
