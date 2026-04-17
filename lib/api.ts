import {
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResult,
  WeatherError,
} from "@/types/weather";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

function getApiKey(): string {
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENWEATHER_API_KEY is not defined in environment variables"
    );
  }
  return apiKey;
}

function handleApiError(response: Response, data: WeatherError): never {
  console.error("[API Error Details]", { status: response.status, ok: response.ok, data });
  if (!response.ok) {
    throw new Error(
      data.message || `Weather API error: ${response.status} ${response.statusText}`
    );
  }
  throw new Error(data.message || "Unknown weather API error");
}

export async function getWeatherByCity(
  city: string
): Promise<CurrentWeatherResponse> {
  const apiKey = getApiKey();
  const url = new URL(`${BASE_URL}/weather`);
  url.searchParams.append("q", city);
  url.searchParams.append("appid", apiKey);
  url.searchParams.append("units", "metric");

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  const data = (await response.json()) as CurrentWeatherResponse | WeatherError;

  if (!response.ok || ("message" in data && typeof data.message === "string")) {
    handleApiError(response, data as WeatherError);
  }

  return data as CurrentWeatherResponse;
}

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> {
  const apiKey = getApiKey();
  const url = new URL(`${BASE_URL}/weather`);
  url.searchParams.append("lat", lat.toString());
  url.searchParams.append("lon", lon.toString());
  url.searchParams.append("appid", apiKey);
  url.searchParams.append("units", "metric");

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  const data = (await response.json()) as CurrentWeatherResponse | WeatherError;

  if (!response.ok || ("message" in data && typeof data.message === "string")) {
    handleApiError(response, data as WeatherError);
  }

  return data as CurrentWeatherResponse;
}

export async function getForecastByCity(city: string): Promise<ForecastResponse> {
  const apiKey = getApiKey();
  const url = new URL(`${BASE_URL}/forecast`);
  url.searchParams.append("q", city);
  url.searchParams.append("appid", apiKey);
  url.searchParams.append("units", "metric");

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  const data = (await response.json()) as ForecastResponse | WeatherError;

  if (!response.ok || ("message" in data && typeof data.message === "string")) {
    handleApiError(response, data as WeatherError);
  }

  return data as ForecastResponse;
}

export async function getForecastByCoords(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  const apiKey = getApiKey();
  const url = new URL(`${BASE_URL}/forecast`);
  url.searchParams.append("lat", lat.toString());
  url.searchParams.append("lon", lon.toString());
  url.searchParams.append("appid", apiKey);
  url.searchParams.append("units", "metric");

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  const data = (await response.json()) as ForecastResponse | WeatherError;

  if (!response.ok || ("message" in data && typeof data.message === "string")) {
    handleApiError(response, data as WeatherError);
  }

  return data as ForecastResponse;
}

export async function geocodeCity(
  city: string
): Promise<GeocodingResult[]> {
  const apiKey = getApiKey();
  const url = new URL(`${GEO_URL}/direct`);
  url.searchParams.append("q", city);
  url.searchParams.append("appid", apiKey);
  url.searchParams.append("limit", "5");

  const response = await fetch(url.toString(), {
    next: { revalidate: 86400 }, // Cache for 24 hours (geocoding rarely changes)
  });

  if (!response.ok) {
    const error = (await response.json()) as WeatherError;
    handleApiError(response, error);
  }

  return (await response.json()) as GeocodingResult[];
}
