export type NormalizedStatus = "ok" | "warning" | "error";

export interface Essential {
  name?: string | null;
  status?: string | null;
}

export interface Vehicle {
  id?: string | number;
  plate?: string | null;
  status?: string | null;
  essentials?: Essential[] | null;
}

export interface OptionConfigItem {
  key: string;
  label: string;
  icon?: unknown;
  disabled?: boolean;
  maintenance?: boolean;
  /**
   * Nombres (posibles) del essential asociado a la opción.
   * Se usan para comparar con `vehicle.essentials[].name` (normalizado).
   */
  essentialNames?: string[];
}

