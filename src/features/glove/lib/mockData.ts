import type { Vehicle } from "../types/domain";

export const MOCK_VEHICLES: Vehicle[] = [
  {
    plate: "LJL502"
  },
  {
    plate: "GGZ404"
  },
  {
    plate: "ABC123",
  },
  {
    plate: "MVV421",
  }
];

export function getMockVehicleByPlate(plate: string | undefined) {
  if (!plate) return null;
  const needle = plate.trim().toUpperCase();
  return (
    MOCK_VEHICLES.find((v) => (v.plate ?? "").toUpperCase() === needle) ?? null
  );
}
