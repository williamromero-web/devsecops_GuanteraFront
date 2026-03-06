import { useState, useEffect, useCallback, useRef } from "react";
import { useGuanteraConfig } from "../providers/GuanteraProvider";
import { mapDevicesToVehicles } from "../lib/deviceMapper";
import { MOCK_VEHICLES } from "../lib/mockData";
import type { DevicesParams, DevicesResponse } from "../types/devices";
import type { Vehicle } from "../types/domain";
import { fetchVehiclesModules } from "../services/vehicleService";

export interface UseDevicesParams {
  page: number;

  pageSize: number;

  search?: string;
}

export interface UseDevicesResult {
  vehicles: Vehicle[];

  total: number;

  totalPages: number;

  isLoading: boolean;

  isInitialLoad: boolean;

  error: Error | null;

  refetch: () => Promise<void>;
}

export function useDevices(params: UseDevicesParams): UseDevicesResult {
  const { fetchDevices, devicesApiConfig } = useGuanteraConfig();
  const { page, pageSize, search } = params;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isMountedRef = useRef(true);
  // const requestInFlightRef = useRef(false);
  const requestIdRef = useRef(0);
  const fetchDevicesRef = useRef(fetchDevices);
  const devicesApiConfigRef = useRef(devicesApiConfig);
  fetchDevicesRef.current = fetchDevices;
  devicesApiConfigRef.current = devicesApiConfig;

  const fetchMockDevices = useCallback(
    async (params: DevicesParams): Promise<DevicesResponse> => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const searchTerm = (params.name ?? "").trim().toUpperCase();
      let filtered = MOCK_VEHICLES;

      if (searchTerm) {
        filtered = MOCK_VEHICLES.filter((v) =>
          (v.plate ?? "").toUpperCase().includes(searchTerm),
        );
      }

      const mockPage = params.page ?? 1;
      const mockPageSize = params.pageSize ?? pageSize;
      const start = (mockPage - 1) * mockPageSize;
      const end = start + mockPageSize;
      const pageData = filtered.slice(start, end);
      const mockTotalPages = Math.max(
        1,
        Math.ceil(filtered.length / mockPageSize),
      );

      return {
        data: pageData.map((v) => ({
          id: v.id ?? v.plate ?? "",
          name: v.plate ?? "",
        })),
        meta: {
          total: filtered.length,
          totalPages: mockTotalPages,
          page: mockPage,
          pageSize: mockPageSize,
        },
      };
    },
    [pageSize],
  );

  const loadDevices = useCallback(async () => {
    // if (requestInFlightRef.current) return;
    // requestInFlightRef.current = true;
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    if (isInitialLoad) {
      setVehicles([]);
    }

    const apiConfig = devicesApiConfigRef.current;

    try {
      const searchParamName = apiConfig?.searchParamName ?? "name";
      const requestParams: DevicesParams = {
        page,
        pageSize,
        ...(search?.trim() && { [searchParamName]: search.trim() }),
      };

      const fetchFn = fetchDevicesRef.current ?? fetchMockDevices;
      const response = await fetchFn(requestParams);

      // Si esta no es la última request, ignoramos la respuesta
      if (requestId !== requestIdRef.current) return;
      console.log(response.data);
      
      if (!isMountedRef.current) return;

      let mappedVehicles = mapDevicesToVehicles(response.data);

      if (mappedVehicles.length > 0) {
        try {
          const plates = mappedVehicles
            .map(v => v.plate)
            .filter((plate): plate is string => !!plate); 

          const modulesInfo = await fetchVehiclesModules(plates);

          if (requestId !== requestIdRef.current) return;

          if (!isMountedRef.current) return;
          
          // Cruzamos la información por placa
          mappedVehicles = mappedVehicles
            // .filter(vehicle => modulesInfo.some(m => m.plate === vehicle.plate))
            .map(vehicle => {
              const status = modulesInfo.find(m => m.plate === vehicle.plate);
              return {
                ...vehicle,
                // Si Go nos da un ID real (DB), lo usamos, sino el de Traccar
                id: status?.vehicleId ?? vehicle.id,
                // Inyectamos los módulos o un array vacío si no hay data
                modules: status?.modules ?? [],
                existsInRunt: !!status
              };
            });
        } catch (moduleErr) {
          console.warn("⚠️ No se pudieron cargar los estados de los módulos");
        }
      } else {
          mappedVehicles = []; // Si no hay placas de Traccar, no hay nada que buscar en Go
      }

      setVehicles(mappedVehicles);
      setTotal(response.meta.total ?? mappedVehicles.length);
      setTotalPages(response.meta.totalPages ?? 1);
    } catch (err) {
      if (!isMountedRef.current) return;
      const error =
        err instanceof Error ? err : new Error("Error al cargar dispositivos");
      setError(error);
      console.error("❌ Error loading devices:", error);
    } finally {
      // requestInFlightRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    }
  }, [page, pageSize, search, fetchMockDevices]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    vehicles,
    total,
    totalPages,
    isLoading,
    isInitialLoad,
    error,
    refetch: loadDevices,
  };
}
