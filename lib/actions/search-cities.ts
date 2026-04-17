"use server";

import { geocodeCity } from "@/lib/api";
import { GeocodingResult } from "@/types/weather";

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const results = await geocodeCity(query);
    return results.slice(0, 5); // Limit to 5 suggestions
  } catch {
    return [];
  }
}
