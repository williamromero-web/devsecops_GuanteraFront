import type { Vehicle } from "../types/domain";

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 1,
    plate: "XXX123",
    status: "OK",
    essentials: [
      { name: "SOAT", status: "OK" },
      { name: "Póliza de seguro", status: "PRÓXIMO A VENCER" },
      { name: "Revisión técnico-mecánica", status: "VENCIDO" },
      { name: "Pico y placa", status: "OK" },
      { name: "Tarjeta de propiedad", status: "OK" },
    ],
  },
  // {
  //   id: 2,
  //   plate: "XYZ789",
  //   status: "WARNING",
  //   essentials: [
  //     { name: "Impuesto vehicular", status: "PRÓXIMO A VENCER" },
  //     { name: "Kit de carretera", status: "OK" },
  //     { name: "Guía de control de mantenimiento", status: "OK" },
  //   ],
  // },
  // {
  //   id: 3,
  //   plate: "DEF456",
  //   status: "ERROR",
  //   essentials: [
  //     { name: "SOAT", status: "VENCIDO" },
  //     { name: "Factura", status: "OK" },
  //     { name: "Botiquín", status: "OK" },
  //   ],
  // },
  // {
  //   id: 4,
  //   plate: "KLM321",
  //   status: "OK",
  //   essentials: [
  //     { name: "Póliza de garantía", status: "OK" },
  //     { name: "Tarjeta propiedad", status: "OK" },
  //     { name: "Pico y placa", status: "PRÓXIMO A VENCER" },
  //   ],
  // },
  // {
  //   id: 5,
  //   plate: "QWE852",
  //   status: "OK",
  //   essentials: [{ name: "Asistencias viales", status: "OK" }],
  // },
  // {
  //   id: 6,
  //   plate: "RTY963",
  //   status: "OK",
  //   essentials: [{ name: "Declaración de importación", status: "OK" }],
  // },
  // {
  //   id: 7,
  //   plate: "DEF456",
  //   status: "ERROR",
  //   essentials: [
  //     { name: "SOAT", status: "VENCIDO" },
  //     { name: "Factura", status: "OK" },
  //     { name: "Botiquín", status: "OK" },
  //   ],
  // },
  // {
  //   id: 8,
  //   plate: "KLM321",
  //   status: "OK",
  //   essentials: [
  //     { name: "Póliza de garantía", status: "OK" },
  //     { name: "Tarjeta propiedad", status: "OK" },
  //     { name: "Pico y placa", status: "PRÓXIMO A VENCER" },
  //   ],
  // },
  // {
  //   id: 9,
  //   plate: "QWE852",
  //   status: "OK",
  //   essentials: [{ name: "Asistencias viales", status: "OK" }],
  // },
  // {
  //   id: 10,
  //   plate: "RTY963",
  //   status: "OK",
  //   essentials: [{ name: "Declaración de importación", status: "OK" }],
  // },
];

export function getMockVehicleByPlate(plate: string | undefined) {
  if (!plate) return null;
  const needle = plate.trim().toUpperCase();
  return (
    MOCK_VEHICLES.find((v) => (v.plate ?? "").toUpperCase() === needle) ?? null
  );
}
