"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2, Navigation, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { searchCities } from "@/lib/actions/search-cities";
import { GeocodingResult } from "@/types/weather";

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
}

export function SearchBar({ initialQuery = "", className }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      const results = await searchCities(debouncedQuery);
      setSuggestions(results);
      setIsSearching(false);
      setShowDropdown(results.length > 0);
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setShowDropdown(false);
    router.push(`/?city=${encodeURIComponent(trimmed)}`);
  }

  function handleSelectCity(city: GeocodingResult) {
    setQuery(city.name);
    setShowDropdown(false);
    router.push(`/?city=${encodeURIComponent(city.name)}`);
  }

  function handleGeolocation() {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/?lat=${latitude}&lon=${longitude}`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectCity(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        break;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("relative w-full max-w-2xl", className)} 
      ref={dropdownRef}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "glass-card flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 transition-all duration-300 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.3)]",
          showDropdown && "rounded-b-none border-b-0"
        )}
      >
        <div className="flex flex-1 items-center gap-2 px-2 sm:px-3 min-w-0">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
              if (e.target.value.length >= 2) {
                setShowDropdown(true);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Search city..."
            className="flex-1 bg-transparent py-2.5 sm:py-2 text-sm sm:text-base text-white outline-none placeholder:text-white/40 min-w-0"
            aria-label="Search for a city"
            aria-autocomplete="list"
            autoComplete="off"
          />
          {isSearching && (
            <Loader2 className="h-4 w-4 animate-spin text-violet-400 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleGeolocation}
            disabled={isLocating || isPending}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl text-white/50 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-50"
            aria-label="Use current location"
            title="Use my location"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-cyan-400" />
            ) : (
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!query.trim() || isPending}
            className="h-9 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 sm:px-5 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:opacity-50 whitespace-nowrap"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="hidden sm:inline">Search</span>
            )}
            {isPending ? null : <span className="sm:hidden">Go</span>}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-card absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-2xl border-t-0"
          >
            <ul role="listbox" className="max-h-60 overflow-y-auto py-2">
              {suggestions.map((city, index) => (
                <motion.li
                  key={`${city.lat}-${city.lon}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => handleSelectCity(city)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-3 transition-all",
                    index === highlightedIndex
                      ? "bg-violet-500/20"
                      : "hover:bg-white/5"
                  )}
                >
                  <Navigation className="h-4 w-4 shrink-0 text-violet-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">
                      {city.name}
                      {city.state && (
                        <span className="ml-1 text-white/50">
                          , {city.state}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-white/50">
                      {city.country}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
