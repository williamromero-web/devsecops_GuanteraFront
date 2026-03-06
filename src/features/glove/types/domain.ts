export type NormalizedStatus = "ok" | "warning" | "error" | "expired" | { color: string };

export interface Essential {
  name?: string | null;
  status?: string | null;
}

export interface Vehicle {
  id?: string | number;
  plate?: string | null;
  status?: string | null;
  essentials?: Essential[] | null;
  existsInRunt?: boolean | null;
  modules?: {
    name: string;
    color: string;
  }[];
}

export interface OptionConfigItem {
  key: string;
  label: string;
  icon?: unknown;
  disabled?: boolean;
  maintenance?: boolean;

  essentialNames?: string[];
}

