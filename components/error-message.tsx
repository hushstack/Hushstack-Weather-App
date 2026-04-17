"use client";

import { AlertCircle, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const SUGGESTED_CITIES = [
  { name: "Phnom Penh", country: "Cambodia" },
  { name: "Siem Reap", country: "Cambodia" },
  { name: "Battambang", country: "Cambodia" },
  { name: "Sihanoukville", country: "Cambodia" },
];

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  const isCityNotFound = message.toLowerCase().includes("city not found");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-5 text-rose-200",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          
          {isCityNotFound && (
            <div className="mt-4">
              <p className="mb-3 text-xs text-rose-300/80">
                Try searching for a major city instead. Here are some suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_CITIES.map((city, index) => (
                  <motion.div
                    key={city.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      href={`/?city=${encodeURIComponent(city.name)}`}
                      className="glass-card inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all hover:border-rose-400/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    >
                      <Search className="h-3 w-3 text-rose-400" />
                      {city.name}
                      <ArrowRight className="h-3 w-3 text-rose-400" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
