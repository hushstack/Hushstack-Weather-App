import {
  CurrentWeatherResponse,
  ForecastResponse,
  ForecastItem,
  ProcessedWeather,
  ProcessedForecast,
  ProcessedForecastDay,
} from "@/types/weather";
import {
  getWeatherByCity,
  getWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
} from "./api";

export function processCurrentWeather(
  data: CurrentWeatherResponse
): ProcessedWeather {
  const weather = data.weather[0];

  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    description: weather.description,
    icon: weather.icon,
    condition: weather.main,
    visibility: data.visibility,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timestamp: data.dt,
    timezone: data.timezone,
    coordinates: {
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
  };
}

export function processForecast(data: ForecastResponse): ProcessedForecast {
  const groupedByDay = groupForecastByDay(data.list);
  const days: ProcessedForecastDay[] = Object.entries(groupedByDay).map(
    ([date, items]) => processForecastDay(date, items)
  );

  return {
    city: data.city.name,
    country: data.city.country,
    days,
  };
}

function groupForecastByDay(items: ForecastItem[]): Record<string, ForecastItem[]> {
  return items.reduce((acc, item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);
}

function processForecastDay(
  date: string,
  items: ForecastItem[]
): ProcessedForecastDay {
  const temps = items.map((item) => item.main.temp);
  const humidities = items.map((item) => item.main.humidity);
  const windSpeeds = items.map((item) => item.wind.speed);
  const precipitation = items.reduce((sum, item) => sum + item.pop, 0) / items.length;

  const high = Math.max(...temps);
  const low = Math.min(...temps);
  const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;
  const avgWindSpeed = windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length;

  const middleItem = items[Math.floor(items.length / 2)];
  const weather = middleItem.weather[0];

  return {
    date,
    items,
    high,
    low,
    avgHumidity,
    avgWindSpeed,
    description: weather.description,
    icon: weather.icon,
    condition: weather.main,
    precipitation,
  };
}

export async function fetchWeatherByCity(city: string): Promise<{
  current: ProcessedWeather;
  forecast: ProcessedForecast;
}> {
  try {
    const [currentData, forecastData] = await Promise.all([
      getWeatherByCity(city),
      getForecastByCity(city),
    ]);

    return {
      current: processCurrentWeather(currentData),
      forecast: processForecast(forecastData),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error in fetchWeatherByCity";
    console.error("[Weather Service Error]", message);
    throw new Error(message);
  }
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number
): Promise<{
  current: ProcessedWeather;
  forecast: ProcessedForecast;
}> {
  const [currentData, forecastData] = await Promise.all([
    getWeatherByCoords(lat, lon),
    getForecastByCoords(lat, lon),
  ]);

  return {
    current: processCurrentWeather(currentData),
    forecast: processForecast(forecastData),
  };
}
