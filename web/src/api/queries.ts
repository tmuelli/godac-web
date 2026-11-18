import { useQuery } from "@tanstack/react-query";
import { get } from "./client";
import type { EntrySummary } from "../types/types";

function useList(key: string, path: string) {
  return useQuery({
    queryKey: [key],
    queryFn: () => get<EntrySummary[]>(path),
    staleTime: Infinity,
  });
}

export const useSpecies = () => useList("species", "/api/species");
export const useMoves = () => useList("moves", "/api/moves");
export const useAbilities = () => useList("abilities", "/api/abilities");
export const useItems = () => useList("items", "/api/items");
export const useNatures = () => useList("natures", "/api/natures");
