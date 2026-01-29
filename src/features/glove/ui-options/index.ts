import type { ComponentType } from "react";
import type { ModuleKey } from "../config/optionsConfig";

import {
  Factura,
  ManualVehiculo,
  TarjetaPropiedad,
  ImpuestoVehicular,
  DeclaracionImportacion,
  OtrosDocumentos,
} from "./propiedad";
import {
  Soat,
  PolizaSeguro,
  AsistenciasViales,
  PolizaGarantia,
} from "./seguros";
import {
  RevisionTecnicoMecanica,
  GuiaControlMantenimiento,
} from "./mantenimiento";
import { PicoYPlaca, KitCarretera, Botiquin } from "./operacion";

export const OPTION_COMPONENTS: Record<
  string,
  ComponentType<{ plate: string }>
> = {
  // Propiedad
  "tarjeta-propiedad": TarjetaPropiedad,
  "impuesto-vehicular": ImpuestoVehicular,
  factura: Factura,
  "declaracion-importacion": DeclaracionImportacion,
  "manual-vehiculo": ManualVehiculo,
  "otros-documentos": OtrosDocumentos,

  // Seguros
  soat: Soat,
  "poliza-seguro": PolizaSeguro,
  "asistencias-viales": AsistenciasViales,
  "poliza-garantia": PolizaGarantia,

  // Mantenimiento
  "revision-tecnico-mecanica": RevisionTecnicoMecanica,
  "guia-control-mantenimiento": GuiaControlMantenimiento,

  // Operación
  "pico-y-placa": PicoYPlaca,
  "kit-carretera": KitCarretera,
  botiquin: Botiquin,
};

export function getOptionComponent(
  _moduleKey: ModuleKey,
  optionKey: string | undefined,
) {
  if (!optionKey) return null;
  return OPTION_COMPONENTS[optionKey] ?? null;
}
