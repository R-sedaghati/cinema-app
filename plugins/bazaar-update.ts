import { registerPlugin } from "@capacitor/core";

export type BazaarUpdateStatus = "upToDate" | "updateAvailable";

export interface BazaarUpdateResult {
  status: BazaarUpdateStatus;
  targetVersionCode?: number;
}

export interface BazaarUpdatePlugin {
  checkForUpdate(): Promise<BazaarUpdateResult>;
  startUpdate(): Promise<void>;
}

export const BazaarUpdate = registerPlugin<BazaarUpdatePlugin>("BazaarUpdate");
