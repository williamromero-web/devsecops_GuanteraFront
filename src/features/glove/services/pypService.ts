import { httpGet } from "../lib/httpClient";

interface PypApiResponse {
  success: boolean;
  data: PypData;
}

export interface PypData {
  city: string;
  startTime: string;
  endTime: string;
  pyp: string;
  canCirculateToday: number[];
  cannotCirculateToday: number[];
  description: string;
  notApplicable: boolean;
}

export interface PypCalendarData {
  city: string;
  plate: string;
  startTime: string;
  endTime: string;
  restrictedDays: number[];
  allowedCirculationDays: number[];
}

interface PypCalendarApiResponse {
  success: boolean;
  data: PypCalendarData;
}

export interface Municipality {
  code: string;
  name: string;
}

interface MunicipalitiesApiResponse {
  success: boolean;
  data: Municipality[];
}

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8080";

export async function fetchPypData(
  plate: string,
  municipalityCode?: string,
): Promise<PypData> {
  const path = municipalityCode
    ? `/pyp/${encodeURIComponent(plate)}/${encodeURIComponent(municipalityCode)}`
    : `/pyp/${encodeURIComponent(plate)}`;
  const response = await httpGet<PypApiResponse>(path, { baseUrl: BASE_URL });
  return response.data;
}

export async function fetchPypCalendar(
  plate: string,
  municipalityCode?: string,
): Promise<PypCalendarData> {
  const path = municipalityCode
    ? `/pyp/calendar/${encodeURIComponent(plate)}/${encodeURIComponent(municipalityCode)}`
    : `/pyp/calendar/${encodeURIComponent(plate)}`;
  const response = await httpGet<PypCalendarApiResponse>(path, { baseUrl: BASE_URL });
  return response.data;
}

export async function fetchMunicipalities(): Promise<Municipality[]> {
  const response = await httpGet<MunicipalitiesApiResponse>(
    "/pyp/dropdown/municipalities",
    { baseUrl: BASE_URL },
  );
  return response.data;
}