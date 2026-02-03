import type { Device } from "../types/devices";
import type { Vehicle } from "../types/domain";

/**
 * Mapea un Device (tal como lo devuelve el host/Traccar) a un Vehicle
 * (formato interno del micro frontend Glove).
 *
 * @param device - Dispositivo devuelto por el host
 * @returns Vehicle mapeado para uso interno en Glove
 */
export function mapDeviceToVehicle(device: Device): Vehicle {
  return {
    id: device.id,
    // En Traccar, device.name es la "placa" en el dominio de negocio
    plate: device.name ?? null,
    // status y essentials vendrán del backend de Guantera en una fase posterior
    // Por ahora, dejamos estos campos como null/undefined
    status: null,
    essentials: null,
  };
}

/**
 * Mapea un array de Devices a un array de Vehicles.
 *
 * @param devices - Array de dispositivos devueltos por el host
 * @returns Array de Vehicles mapeados
 */
export function mapDevicesToVehicles(devices: Device[]): Vehicle[] {
  return devices.map(mapDeviceToVehicle);
}
