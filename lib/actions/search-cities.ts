"use server";

import { geocodeCity } from "@/lib/api";
import { GeocodingResult } from "@/types/weather";

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const results = await geocodeCity(query);
    return results.slice(0, 10); // Limit to 10 suggestions for more options
  } catch {
    return [];
  }
}
