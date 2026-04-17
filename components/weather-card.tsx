"use client";

import { Wind, Droplets, Eye, Gauge, Sunrise, Sunset } from "lucide-react";
import { ProcessedWeather } from "@/types/weather";
import { WeatherIcon } from "./weather-icon";
import {
  formatTemperature,
  formatWindSpeed,
  formatHumidity,
  formatPressure,
  formatVisibility,
  formatTime,
  getWindDirection,
} from "@/lib/utils";
import { motion } from "framer-motion";

interface WeatherCardProps {
  weather: ProcessedWeather;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {weather.city}
              <span className="ml-2 text-lg font-normal text-white/60">
                {weather.country}
              </span>
            </h1>
            <p className="mt-1 capitalize text-white/70">
              {weather.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WeatherIcon
              icon={weather.icon}
              description={weather.description}
              size="large"
            />
          </div>
        </div>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
            {formatTemperature(weather.temperature)}
          </span>
          <span className="text-xl text-white/60">
            Feels like {formatTemperature(weather.feelsLike)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
            ↑ {formatTemperature(weather.tempMax)}
          </span>
          <span className="rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
            ↓ {formatTemperature(weather.tempMin)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-3 lg:grid-cols-6">
        <DetailItem
          icon={<Wind className="h-4 w-4" />}
          label="Wind"
          value={`${formatWindSpeed(weather.windSpeed)} ${getWindDirection(weather.windDeg)}`}
        />
        <DetailItem
          icon={<Droplets className="h-4 w-4" />}
          label="Humidity"
          value={formatHumidity(weather.humidity)}
        />
        <DetailItem
          icon={<Eye className="h-4 w-4" />}
          label="Visibility"
          value={formatVisibility(weather.visibility)}
        />
        <DetailItem
          icon={<Gauge className="h-4 w-4" />}
          label="Pressure"
          value={formatPressure(weather.pressure)}
        />
        <DetailItem
          icon={<Sunrise className="h-4 w-4" />}
          label="Sunrise"
          value={formatTime(weather.sunrise, weather.timezone)}
        />
        <DetailItem
          icon={<Sunset className="h-4 w-4" />}
          label="Sunset"
          value={formatTime(weather.sunset, weather.timezone)}
        />
      </div>
    </motion.div>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
      className="group flex flex-col items-start gap-1 border-r border-white/10 p-4 last:border-r-0 sm:p-5 transition-colors">
      <div className="flex items-center gap-1.5 text-white/50 group-hover:text-violet-400 transition-colors">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
        {value}
      </span>
    </motion.div>
  );
}
