"use client";

import { ProcessedForecastDay, ForecastItem } from "@/types/weather";
import { WeatherIcon } from "./weather-icon";
import {
  formatTemperature,
  formatHumidity,
  formatDate,
  formatShortDay,
} from "@/lib/utils";
import { Droplets, Wind } from "lucide-react";
import { motion } from "framer-motion";

interface ForecastGridProps {
  days: ProcessedForecastDay[];
}

export function ForecastGrid({ days }: ForecastGridProps) {
  if (days.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
        5-Day Forecast
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {days.slice(0, 5).map((day, index) => (
          <ForecastDayCard key={day.date} day={day} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

interface ForecastDayCardProps {
  day: ProcessedForecastDay;
  index: number;
}

function ForecastDayCard({ day, index }: ForecastDayCardProps) {
  const displayItems = day.items.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <p className="font-semibold text-white">
            {formatShortDay(new Date(day.date).getTime() / 1000)}
          </p>
          <p className="text-xs text-white/50">
            {formatDate(new Date(day.date).getTime() / 1000)}
          </p>
        </div>
        <WeatherIcon
          icon={day.icon}
          description={day.description}
          size="small"
        />
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-2xl font-bold text-white">
            {formatTemperature(day.high)}
          </span>
          <span className="text-lg text-white/50">
            / {formatTemperature(day.low)}
          </span>
        </div>
        <p className="mt-1 text-center text-sm capitalize text-white/70">
          {day.description}
        </p>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
            <Droplets className="h-3 w-3" />
            {formatHumidity(day.avgHumidity)}
          </span>
          <span className="flex items-center gap-1 hover:text-violet-400 transition-colors">
            <Wind className="h-3 w-3" />
            {Math.round(day.avgWindSpeed)} m/s
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/5 p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
          Hourly
        </p>
        <div className="grid grid-cols-4 gap-2">
          {displayItems.map((item, idx) => (
            <ForecastHourlyItem key={idx} item={item} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface ForecastHourlyItemProps {
  item: ForecastItem;
}

function ForecastHourlyItem({ item }: ForecastHourlyItemProps) {
  const hour = item.dt_txt.split(" ")[1]?.slice(0, 5) ?? "";

  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-white/5 p-2 backdrop-blur-sm">
      <span className="text-[10px] font-medium text-white/50">
        {hour}
      </span>
      <WeatherIcon
        icon={item.weather[0]?.icon ?? "01d"}
        description={item.weather[0]?.description ?? ""}
        size="small"
      />
      <span className="text-xs font-semibold text-white">
        {formatTemperature(item.main.temp)}
      </span>
    </div>
  );
}
