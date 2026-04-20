import { WeatherCard } from "@/components/weather-card";
import { ForecastGrid } from "@/components/forecast-grid";
import { ErrorMessage } from "@/components/error-message";
import { fetchWeatherByCity } from "@/lib/weather-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface WeatherPageProps {
  params: Promise<{ city: string }>;
}

async function fetchWeatherData(city: string) {
  try {
    return await fetchWeatherByCity(city);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch weather data";
    return { error: message };
  }
}

export default async function WeatherPage({ params }: WeatherPageProps) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  const result = await fetchWeatherData(decodedCity);

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
