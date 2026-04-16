import type { Vehicle } from "../types/domain";

export const MOCK_VEHICLES: Vehicle[] = [
  {
    plate: "MKQ689"
  },
  {
    plate: "GGZ404"
  },
  {
    plate: "BLL353",
  },
  {
    plate: "RML886",
  }
];

export function getMockVehicleByPlate(plate: string | undefined) {
  if (!plate) return null;
  const needle = plate.trim().toUpperCase();
  return (
    MOCK_VEHICLES.find((v) => (v.plate ?? "").toUpperCase() === needle) ?? null
  );
}
