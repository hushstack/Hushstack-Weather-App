"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2, Sparkles, SlidersHorizontal, Globe, Building2, MapPinned } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { searchCities } from "@/lib/actions/search-cities";
import { GeocodingResult } from "@/types/weather";
import { Suspense, lazy } from "react";

// Dynamically import flag components
const flagImports: Record<string, () => Promise<{ default: React.ComponentType<{ className?: string }> }>> = {
  US: () => import("country-flag-icons/react/3x2/US"),
  GB: () => import("country-flag-icons/react/3x2/GB"),
  JP: () => import("country-flag-icons/react/3x2/JP"),
  FR: () => import("country-flag-icons/react/3x2/FR"),
  DE: () => import("country-flag-icons/react/3x2/DE"),
  CN: () => import("country-flag-icons/react/3x2/CN"),
  IN: () => import("country-flag-icons/react/3x2/IN"),
  RU: () => import("country-flag-icons/react/3x2/RU"),
  BR: () => import("country-flag-icons/react/3x2/BR"),
  CA: () => import("country-flag-icons/react/3x2/CA"),
  AU: () => import("country-flag-icons/react/3x2/AU"),
  IT: () => import("country-flag-icons/react/3x2/IT"),
  ES: () => import("country-flag-icons/react/3x2/ES"),
  MX: () => import("country-flag-icons/react/3x2/MX"),
  KR: () => import("country-flag-icons/react/3x2/KR"),
  SG: () => import("country-flag-icons/react/3x2/SG"),
  AE: () => import("country-flag-icons/react/3x2/AE"),
  KH: () => import("country-flag-icons/react/3x2/KH"),
  TH: () => import("country-flag-icons/react/3x2/TH"),
  VN: () => import("country-flag-icons/react/3x2/VN"),
  ID: () => import("country-flag-icons/react/3x2/ID"),
  MY: () => import("country-flag-icons/react/3x2/MY"),
  PH: () => import("country-flag-icons/react/3x2/PH"),
  NL: () => import("country-flag-icons/react/3x2/NL"),
  SE: () => import("country-flag-icons/react/3x2/SE"),
  NO: () => import("country-flag-icons/react/3x2/NO"),
  FI: () => import("country-flag-icons/react/3x2/FI"),
  DK: () => import("country-flag-icons/react/3x2/DK"),
  PL: () => import("country-flag-icons/react/3x2/PL"),
  UA: () => import("country-flag-icons/react/3x2/UA"),
  TR: () => import("country-flag-icons/react/3x2/TR"),
  SA: () => import("country-flag-icons/react/3x2/SA"),
  ZA: () => import("country-flag-icons/react/3x2/ZA"),
  EG: () => import("country-flag-icons/react/3x2/EG"),
  NZ: () => import("country-flag-icons/react/3x2/NZ"),
  CH: () => import("country-flag-icons/react/3x2/CH"),
  AT: () => import("country-flag-icons/react/3x2/AT"),
  BE: () => import("country-flag-icons/react/3x2/BE"),
  PT: () => import("country-flag-icons/react/3x2/PT"),
  GR: () => import("country-flag-icons/react/3x2/GR"),
  IL: () => import("country-flag-icons/react/3x2/IL"),
  AR: () => import("country-flag-icons/react/3x2/AR"),
  CL: () => import("country-flag-icons/react/3x2/CL"),
  CO: () => import("country-flag-icons/react/3x2/CO"),
  PE: () => import("country-flag-icons/react/3x2/PE"),
  VE: () => import("country-flag-icons/react/3x2/VE"),
  EC: () => import("country-flag-icons/react/3x2/EC"),
  BO: () => import("country-flag-icons/react/3x2/BO"),
  PY: () => import("country-flag-icons/react/3x2/PY"),
  UY: () => import("country-flag-icons/react/3x2/UY"),
  GF: () => import("country-flag-icons/react/3x2/GF"),
  FK: () => import("country-flag-icons/react/3x2/FK"),
  GL: () => import("country-flag-icons/react/3x2/GL"),
  NC: () => import("country-flag-icons/react/3x2/NC"),
  PF: () => import("country-flag-icons/react/3x2/PF"),
  WF: () => import("country-flag-icons/react/3x2/WF"),
  PM: () => import("country-flag-icons/react/3x2/PM"),
  GP: () => import("country-flag-icons/react/3x2/GP"),
  MQ: () => import("country-flag-icons/react/3x2/MQ"),
  RE: () => import("country-flag-icons/react/3x2/RE"),
  YT: () => import("country-flag-icons/react/3x2/YT"),
  TF: () => import("country-flag-icons/react/3x2/TF"),
  BV: () => import("country-flag-icons/react/3x2/BV"),
  HM: () => import("country-flag-icons/react/3x2/HM"),
  UM: () => import("country-flag-icons/react/3x2/UM"),
  AX: () => import("country-flag-icons/react/3x2/AX"),
  BL: () => import("country-flag-icons/react/3x2/BL"),
  MF: () => import("country-flag-icons/react/3x2/MF"),
  SX: () => import("country-flag-icons/react/3x2/SX"),
  BQ: () => import("country-flag-icons/react/3x2/BQ"),
  CW: () => import("country-flag-icons/react/3x2/CW"),
  SS: () => import("country-flag-icons/react/3x2/SS"),
  XK: () => import("country-flag-icons/react/3x2/XK"),
  TW: () => import("country-flag-icons/react/3x2/TW"),
  HK: () => import("country-flag-icons/react/3x2/HK"),
  MO: () => import("country-flag-icons/react/3x2/MO"),
  IE: () => import("country-flag-icons/react/3x2/IE"),
  IS: () => import("country-flag-icons/react/3x2/IS"),
  LI: () => import("country-flag-icons/react/3x2/LI"),
  MC: () => import("country-flag-icons/react/3x2/MC"),
  SM: () => import("country-flag-icons/react/3x2/SM"),
  VA: () => import("country-flag-icons/react/3x2/VA"),
  MT: () => import("country-flag-icons/react/3x2/MT"),
  LU: () => import("country-flag-icons/react/3x2/LU"),
  AD: () => import("country-flag-icons/react/3x2/AD"),
  BY: () => import("country-flag-icons/react/3x2/BY"),
  MD: () => import("country-flag-icons/react/3x2/MD"),
  RO: () => import("country-flag-icons/react/3x2/RO"),
  BG: () => import("country-flag-icons/react/3x2/BG"),
  RS: () => import("country-flag-icons/react/3x2/RS"),
  HR: () => import("country-flag-icons/react/3x2/HR"),
  SI: () => import("country-flag-icons/react/3x2/SI"),
  BA: () => import("country-flag-icons/react/3x2/BA"),
  MK: () => import("country-flag-icons/react/3x2/MK"),
  ME: () => import("country-flag-icons/react/3x2/ME"),
  AL: () => import("country-flag-icons/react/3x2/AL"),
  LT: () => import("country-flag-icons/react/3x2/LT"),
  LV: () => import("country-flag-icons/react/3x2/LV"),
  EE: () => import("country-flag-icons/react/3x2/EE"),
  CZ: () => import("country-flag-icons/react/3x2/CZ"),
  SK: () => import("country-flag-icons/react/3x2/SK"),
  HU: () => import("country-flag-icons/react/3x2/HU"),
  AZ: () => import("country-flag-icons/react/3x2/AZ"),
  AM: () => import("country-flag-icons/react/3x2/AM"),
  GE: () => import("country-flag-icons/react/3x2/GE"),
  KZ: () => import("country-flag-icons/react/3x2/KZ"),
  UZ: () => import("country-flag-icons/react/3x2/UZ"),
  TM: () => import("country-flag-icons/react/3x2/TM"),
  KG: () => import("country-flag-icons/react/3x2/KG"),
  TJ: () => import("country-flag-icons/react/3x2/TJ"),
  AF: () => import("country-flag-icons/react/3x2/AF"),
  PK: () => import("country-flag-icons/react/3x2/PK"),
  BD: () => import("country-flag-icons/react/3x2/BD"),
  LK: () => import("country-flag-icons/react/3x2/LK"),
  MV: () => import("country-flag-icons/react/3x2/MV"),
  NP: () => import("country-flag-icons/react/3x2/NP"),
  BT: () => import("country-flag-icons/react/3x2/BT"),
  MM: () => import("country-flag-icons/react/3x2/MM"),
  LA: () => import("country-flag-icons/react/3x2/LA"),
  MN: () => import("country-flag-icons/react/3x2/MN"),
  KP: () => import("country-flag-icons/react/3x2/KP"),
  IQ: () => import("country-flag-icons/react/3x2/IQ"),
  IR: () => import("country-flag-icons/react/3x2/IR"),
  SY: () => import("country-flag-icons/react/3x2/SY"),
  LB: () => import("country-flag-icons/react/3x2/LB"),
  JO: () => import("country-flag-icons/react/3x2/JO"),
  PS: () => import("country-flag-icons/react/3x2/PS"),
  OM: () => import("country-flag-icons/react/3x2/OM"),
  YE: () => import("country-flag-icons/react/3x2/YE"),
  QA: () => import("country-flag-icons/react/3x2/QA"),
  BH: () => import("country-flag-icons/react/3x2/BH"),
  KW: () => import("country-flag-icons/react/3x2/KW"),
  CY: () => import("country-flag-icons/react/3x2/CY"),
  NG: () => import("country-flag-icons/react/3x2/NG"),
  ET: () => import("country-flag-icons/react/3x2/ET"),
  KE: () => import("country-flag-icons/react/3x2/KE"),
  TZ: () => import("country-flag-icons/react/3x2/TZ"),
  UG: () => import("country-flag-icons/react/3x2/UG"),
  RW: () => import("country-flag-icons/react/3x2/RW"),
  BI: () => import("country-flag-icons/react/3x2/BI"),
};

// Pre-create lazy components for all flags outside render
const flagComponents: Record<string, React.LazyExoticComponent<React.ComponentType<{ className?: string }>>> = {};
Object.entries(flagImports).forEach(([code, importFn]) => {
  flagComponents[code] = lazy(importFn);
});

// Flag icon component that uses pre-created lazy components
function FlagIcon({ countryCode, className }: { countryCode: string; className?: string }) {
  const code = countryCode.toUpperCase();
  const FlagComponent = flagComponents[code];

  if (!FlagComponent) {
    return <span className={className}>{countryCode}</span>;
  }

  return (
    <Suspense fallback={<span className={className}>{countryCode}</span>}>
      <FlagComponent className={className} />
    </Suspense>
  );
}

type FilterType = "all" | "country" | "city" | "state";

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
}

const filterLabels: Record<FilterType, { label: string; icon: React.ReactNode }> = {
  all: { label: "All", icon: <SlidersHorizontal className="h-4 w-4" /> },
  country: { label: "Country", icon: <Globe className="h-4 w-4" /> },
  city: { label: "City", icon: <Building2 className="h-4 w-4" /> },
  state: { label: "State", icon: <MapPinned className="h-4 w-4" /> },
};

// Country name to code mapping for filtering
const countryNameToCode: Record<string, string> = {
  cambodia: "KH", kh: "KH",
  unitedstates: "US", usa: "US", us: "US", america: "US",
  unitedkingdom: "GB", uk: "GB", gb: "GB", britain: "GB",
  japan: "JP", jp: "JP",
  france: "FR", fr: "FR",
  germany: "DE", de: "DE",
  china: "CN", cn: "CN",
  india: "IN", in: "IN",
  russia: "RU", ru: "RU",
  brazil: "BR", br: "BR",
  canada: "CA", ca: "CA",
  australia: "AU", au: "AU",
  italy: "IT", it: "IT",
  spain: "ES", es: "ES",
  mexico: "MX", mx: "MX",
  korea: "KR", southkorea: "KR", kr: "KR",
  singapore: "SG", sg: "SG",
  uae: "AE", unitedarabemirates: "AE", ae: "AE",
  thailand: "TH", th: "TH",
  vietnam: "VN", vn: "VN",
  indonesia: "ID", id: "ID",
  malaysia: "MY", my: "MY",
  philippines: "PH", ph: "PH",
};

export function SearchBar({ initialQuery = "", className }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<GeocodingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        setFilteredSuggestions([]);
        return;
      }

      setIsSearching(true);
      const results = await searchCities(debouncedQuery);
      setSuggestions(results);
      
      // Apply filter
      let filtered = results;
      const queryLower = debouncedQuery.toLowerCase().replace(/\s+/g, "");
      
      if (activeFilter === "country") {
        // Try to find country code from name
        const countryCode = countryNameToCode[queryLower];
        if (countryCode) {
          // Filter to show only results from this country
          filtered = results.filter(r => r.country === countryCode);
        } else {
          // Try exact match on country name field (some APIs return full names)
          filtered = results.filter(r => 
            r.name.toLowerCase().includes(debouncedQuery.toLowerCase()) &&
            (!r.state || r.state === "") // Prefer cities over states for country search
          );
        }
      } else if (activeFilter === "city") {
        filtered = results.filter(r => !r.state || r.state === "");
      } else if (activeFilter === "state") {
        filtered = results.filter(r => r.state && r.state !== "");
      }
      
      setFilteredSuggestions(filtered);
      setIsSearching(false);
      setShowDropdown(filtered.length > 0);
    }

    fetchSuggestions();
  }, [debouncedQuery, activeFilter]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node) &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setShowFilterMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setShowDropdown(false);
    
    // If user selected from dropdown (highlighted), use that city's coordinates
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      const city = suggestions[highlightedIndex];
      router.push(`/weather/coords?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}`);
      return;
    }
    
    // Otherwise, search by name directly
    router.push(`/weather/${encodeURIComponent(trimmed)}`);
  }

  function handleSelectCity(city: GeocodingResult) {
    setQuery(city.name);
    setShowDropdown(false);
    // Use coordinates (lat/lon) for reliable weather lookup - works for ALL places
    router.push(`/weather/coords?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}`);
  }

  function handleGeolocation() {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/weather/coords?lat=${latitude}&lon=${longitude}`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectCity(filteredSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setShowFilterMenu(false);
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
              if (filteredSuggestions.length > 0) setShowDropdown(true);
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
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl text-white/50 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
            className="h-9 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 sm:px-5 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:opacity-50 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="hidden sm:inline">Search</span>
            )}
            {isPending ? null : <span className="sm:hidden">Go</span>}
          </motion.button>
          
          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <motion.button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl",
                "text-white/60 transition-all cursor-pointer",
                "hover:bg-violet-500/20 hover:text-violet-400",
                showFilterMenu && "bg-violet-500/20 text-violet-400"
              )}
              title="Filter results"
            >
              <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            
            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute right-0 top-full mt-2",
                    "glass-card rounded-xl overflow-hidden z-50",
                    "min-w-[140px] shadow-[0_10px_40px_rgba(139,92,246,0.3)]"
                  )}
                >
                  <div className="py-1">
                    {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setActiveFilter(filter);
                          setShowFilterMenu(false);
                          setHighlightedIndex(-1);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-all cursor-pointer",
                          activeFilter === filter
                            ? "bg-violet-500/30 text-white"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {filterLabels[filter].icon}
                        <span>{filterLabels[filter].label}</span>
                        {activeFilter === filter && (
                          <motion.div
                            layoutId="activeFilter"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-card absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-2xl border-t-0"
          >
            <ul role="listbox" className="max-h-[420px] overflow-y-auto py-2">
              {filteredSuggestions.map((city, index) => (
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
                  <div className="flex items-center gap-3 w-full">
                    <div className="shrink-0 w-6 h-4 overflow-hidden rounded-sm">
                      <FlagIcon countryCode={city.country} className="w-full h-full object-cover" />
                    </div>
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
                        {city.state && (
                          <span className="ml-1">
                            • {city.state}
                          </span>
                        )}
                      </p>
                    </div>
                    {/* Type Badge */}
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide",
                      city.state
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-cyan-500/20 text-cyan-300"
                    )}>
                      {city.state ? "State" : "City"}
                    </span>
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
