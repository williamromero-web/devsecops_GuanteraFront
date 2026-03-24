import type { ModuleKey } from "../config/optionsConfig";
import type { NormalizedStatus, OptionConfigItem, Vehicle } from "../types/domain";

export function normalizeString(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .trim();
}

export function normalizeStatus(status: string | null | undefined): NormalizedStatus {
  if (!status) return "ok";
  const s = normalizeString(status).toUpperCase();

  // OK / vigente
  if (s === "OK" || s === "ACTIVE" || s === "VIGENTE") return "ok";

  // warning / próximo a vencer
  if (s === "PROXIMO A VENCER" || s === "WARNING" || s === "ADVERTENCIA") return "warning";

  // vencido / error
  if (s === "VENCIDO" || s === "EXPIRED" || s === "ERROR" || s === "INACTIVE") return "error";

  return "ok";
}

export function getVehicleStatus(normalized: NormalizedStatus): "activo" | "advertencia" | "error" {
  if (normalized === "ok") return "activo";
  if (normalized === "warning") return "advertencia";
  return "error";
}

export function getAggregatedStatus(vehicle: Vehicle | null | undefined): NormalizedStatus {
  const essentials = vehicle?.essentials;
  if (Array.isArray(essentials) && essentials.length > 0) {
    let hasWarning = false;
    for (const e of essentials) {
      const st = normalizeStatus(e?.status ?? undefined);
      if (st === "error") return "error";
      if (st === "warning") hasWarning = true;
    }
    if (hasWarning) return "warning";
  }

  if (vehicle?.status) {
    return normalizeStatus(vehicle.status);
  }

  return "ok";
}

export function getOptionStatus(vehicle: Vehicle | null | undefined, option: OptionConfigItem): NormalizedStatus {
  const essentials = vehicle?.essentials;
  const names = option.essentialNames ?? [];

  if (!Array.isArray(essentials) || essentials.length === 0) return "ok";
  if (!names.length) return "ok";

  const normalizedOptionNames = names.map(normalizeString);

  const match = essentials.find((e) => {
    const essentialName = normalizeString(e?.name ?? "");
    return normalizedOptionNames.some((optName) => essentialName.includes(optName));
  });

  if (!match) return "ok";
  return normalizeStatus(match.status ?? undefined);
}

export function getModuleStatus(
  vehicle: Vehicle | null | undefined,
  moduleKey: ModuleKey,
  essentialModuleMap: Record<ModuleKey, string[]>,
): NormalizedStatus {
  const essentials = vehicle?.essentials;
  if (!Array.isArray(essentials) || essentials.length === 0) return "ok";

  const moduleNames = (essentialModuleMap[moduleKey] ?? []).map(normalizeString);

  const moduleEssentials = essentials.filter((e) => {
    const essentialName = normalizeString(e?.name ?? "");
    return moduleNames.some((mn) => {
      if (essentialName.includes(mn)) return true;
      if (mn.includes(essentialName) && essentialName.length > 3) return true;
      return false;
    });
  });

  if (!moduleEssentials.length) return "ok";

  let hasWarning = false;
  for (const e of moduleEssentials) {
    const st = normalizeStatus(e?.status ?? undefined);
    if (st === "error") return "error";
    if (st === "warning") hasWarning = true;
  }

  return hasWarning ? "warning" : "ok";
}

