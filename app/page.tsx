import { SearchBar } from "@/components/search-bar";
import { WeatherCard } from "@/components/weather-card";
import { ForecastGrid } from "@/components/forecast-grid";
import { ErrorMessage } from "@/components/error-message";
import { EmptyState } from "@/components/empty-state";
import { fetchWeatherByCity, fetchWeatherByCoords } from "@/lib/weather-service";
import { Suspense } from "react";

interface SearchParams {
  city?: string;
  lat?: string;
  lon?: string;
}

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

interface WeatherData {
  type: "success";
  current: Awaited<ReturnType<typeof fetchWeatherByCity>>["current"];
  forecast: Awaited<ReturnType<typeof fetchWeatherByCity>>["forecast"];
}

interface WeatherError {
  type: "error";
  message: string;
}

type WeatherResult = WeatherData | WeatherError;

async function fetchWeatherData(params: SearchParams): Promise<WeatherResult> {
  const { city, lat, lon } = params;

  if (!city && !(lat && lon)) {
    return { type: "error", message: "" };
  }

  try {
    const result = lat && lon
      ? await fetchWeatherByCoords(parseFloat(lat), parseFloat(lon))
      : await fetchWeatherByCity(city!);

    return { type: "success", ...result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch weather data";
    return { type: "error", message };
  }
}

async function WeatherContent({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const result = await fetchWeatherData(params);

  if (result.type === "error") {
    if (!result.message) {
      return <EmptyState />;
    }
    return <ErrorMessage message={result.message} />;
  }

  const { current, forecast } = result;

  return (
    <div className="space-y-8">
      <WeatherCard weather={current} />
      <ForecastGrid days={forecast.days} />
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="space-y-8">
      <div className="glass-card animate-pulse rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-lg bg-white/10" />
            <div className="h-4 w-32 rounded-lg bg-white/5" />
          </div>
          <div className="h-24 w-24 rounded-lg bg-white/10" />
        </div>
        <div className="mt-6 h-16 w-32 rounded-lg bg-white/10" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="glass-card h-48 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8 flex flex-col items-center gap-4 sm:gap-6">
          <h1 className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-2xl sm:text-3xl font-bold tracking-tight text-transparent lg:text-5xl">
            Weather App
          </h1>
          <SearchBar initialQuery={params.city} />
        </header>

        <Suspense fallback={<WeatherSkeleton />}>
          <WeatherContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
