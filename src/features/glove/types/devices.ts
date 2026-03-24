export interface DevicesParams {
  page?: number;

  pageSize?: number;

  name?: string;

  [key: string]: unknown;
}

export interface DevicesMeta {
  totalPages?: number;

  total?: number;

  page?: number;

  pageSize?: number;

  [key: string]: unknown;
}

export interface Device {
  id: number | string;

  name: string;

  uniqueId?: string;

  [key: string]: unknown;
}

export interface DevicesResponse {
  data: Device[];

  meta: DevicesMeta;
}

export type FetchDevicesFunction = (
  params: DevicesParams,
) => Promise<DevicesResponse>;
