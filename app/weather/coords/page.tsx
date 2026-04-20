import { WeatherCard } from "@/components/weather-card";
import { ForecastGrid } from "@/components/forecast-grid";
import { ErrorMessage } from "@/components/error-message";
import { fetchWeatherByCoords } from "@/lib/weather-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CoordsPageProps {
  searchParams: Promise<{ lat?: string; lon?: string; name?: string }>;
}

async function fetchWeatherData(lat: number, lon: number) {
  try {
    return await fetchWeatherByCoords(lat, lon);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch weather data";
    return { error: message };
  }
}

export default async function CoordsWeatherPage({ searchParams }: CoordsPageProps) {
  const params = await searchParams;
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lon = params.lon ? parseFloat(params.lon) : null;

  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    notFound();
  }

  const result = await fetchWeatherData(lat, lon);

  if ("error" in result) {
    if (result.error.includes("not found") || result.error.includes("404")) {
      notFound();
    }
    return (
      <main className="min-h-screen px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ErrorMessage message={result.error} />
        </div>
      </main>
    );
  }

  const { current, forecast } = result;

  return (
    <main className="min-h-screen px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to search</span>
          </Link>
        </div>

        <div className="space-y-8">
          <WeatherCard weather={current} />
          <ForecastGrid days={forecast.days} />
        </div>
      </div>
    </main>
  );
}
