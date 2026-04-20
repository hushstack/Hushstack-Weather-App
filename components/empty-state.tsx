"use client";

import { CloudSun, MapPin, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import GB from "country-flag-icons/react/3x2/GB";
import US from "country-flag-icons/react/3x2/US";
import JP from "country-flag-icons/react/3x2/JP";
import FR from "country-flag-icons/react/3x2/FR";
import SG from "country-flag-icons/react/3x2/SG";
import AU from "country-flag-icons/react/3x2/AU";
import AE from "country-flag-icons/react/3x2/AE";
import KH from "country-flag-icons/react/3x2/KH";

const POPULAR_CITIES = [
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
  { name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
  { name: "Phnom Penh", country: "KH", lat: 11.5564, lon: 104.9282 },
];

// Map country codes to flag components
const FlagComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  GB, US, JP, FR, SG, AU, AE, KH,
};

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-violet-400/30"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  className?: string;
}

export function EmptyState({ className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`mx-auto max-w-4xl py-8 sm:py-12 px-2 sm:px-0 relative ${className}`}
    >
      <FloatingParticles />

      {/* Main Hero Section */}
      <div className="mb-12 text-center relative">
        {/* Animated rings behind icon */}
        <div className="relative inline-block mb-6">
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/30 to-cyan-500/30 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-4 rounded-3xl border border-violet-500/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30 backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
          >
            <CloudSun className="h-10 w-10 sm:h-12 sm:w-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </motion.div>

          {/* Sparkle decorations */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-3"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent mb-3 sm:mb-4"
        >
          Discover Weather
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto max-w-lg text-sm sm:text-base text-white/60 leading-relaxed px-4 sm:px-0"
        >
          Explore real-time weather updates for any city worldwide.
          Search above or pick a trending destination.
        </motion.p>
      </div>

      {/* Popular Cities Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
          <Compass className="h-4 w-4 text-violet-400" />
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/50">
            Trending Cities
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4">
          {POPULAR_CITIES.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.08, duration: 0.3 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/weather/coords?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}`}
                className="glass-card group flex items-center gap-3 rounded-2xl p-4 transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] relative overflow-hidden cursor-pointer"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-violet-400/30 transition-colors overflow-hidden"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {(() => {
                    const FlagComponent = FlagComponents[city.country];
                    return FlagComponent ? <FlagComponent className="h-6 w-6 rounded-sm" /> : <span className="text-lg">🌍</span>;
                  })()}
                </motion.div>

                <div className="min-w-0 text-left relative">
                  <p className="truncate font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {city.name}
                  </p>
                  <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                    {city.country}
                  </p>
                </div>

                {/* Arrow on hover */}
                <motion.div
                  className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                >
                  <MapPin className="h-4 w-4 text-violet-400" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-xs text-white/40">
            Live data from OpenWeatherMap
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
