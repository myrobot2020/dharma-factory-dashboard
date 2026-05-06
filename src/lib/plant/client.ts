import type { PlantClient } from "./types";
import { MockPlantClient } from "./mock-client";

let _client: PlantClient | null = null;

/** Singleton plant client. Picks adapter via VITE_PLANT_MODE. */
export function getPlantClient(): PlantClient {
  if (_client) return _client;
  const mode = (import.meta.env.VITE_PLANT_MODE as string | undefined) ?? "mock";
  if (mode === "http") {
    // Future: swap to HTTP/WS implementation. Same interface.
    throw new Error(
      "VITE_PLANT_MODE=http not yet implemented. Mock adapter is the default.",
    );
  }
  _client = new MockPlantClient();
  return _client;
}

export type { PlantClient } from "./types";
