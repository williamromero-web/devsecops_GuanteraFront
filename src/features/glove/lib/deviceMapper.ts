import type { Device } from "../types/devices";
import type { Vehicle } from "../types/domain";

export function mapDeviceToVehicle(device: Device): Vehicle {
  return {
    id: device.id,

    plate: device.name ?? null,

    status: null,
    essentials: null,
  };
}

export function mapDevicesToVehicles(devices: Device[]): Vehicle[] {
  return devices.map(mapDeviceToVehicle);
}
