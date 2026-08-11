export interface Person {
  name: string;
  mass: string;
  height: string;
  hair_color: string;
  skin_color: string;
  // SWAPI returns more fields than we need (birth_year, films, etc.)
  // We only type what we use, but allow the rest to exist untyped
  [key: string]: unknown;
}

export interface SwapiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}
