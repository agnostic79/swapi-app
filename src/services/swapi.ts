import type { SwapiResponse } from "../types/swapi";
import { getCache, setCache, clearCache } from "../utils/cache";

const BASE_URL = "https://swapi.py4e.com/api/people";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(page: number): string {
  return `swapi_people_page_${page}`;
}

export async function fetchPeople(page: number = 1, options: { bypassCache?: boolean } = {}): Promise<SwapiResponse> {
  const cacheKey = getCacheKey(page);

  if (!options.bypassCache) {
    const cached = getCache<SwapiResponse>(cacheKey, CACHE_TTL_MS);
    if (cached) {
      return cached;
    }
  }

  const response = await fetch(`${BASE_URL}/?page=${page}`);

  if (!response.ok) {
    throw new Error(`SWAPI request failed with status ${response.status}`);
  }

  const data: SwapiResponse = await response.json();
  setCache(cacheKey, data);

  return data;
}

export function invalidatePeopleCache(page: number): void {
  clearCache(getCacheKey(page));
}
