import { LANDING_COPY } from "../constants/landingCopy.ts";
import type { LandingCopyKey } from "../constants/landingCopy.ts";
import { makeResolver } from "./copy.ts";
import type { CopyResolver } from "./copy.ts";

let resolve: CopyResolver<LandingCopyKey> = makeResolver(LANDING_COPY);

/** `useLandingCopy` publishes its resolver here whenever the overrides change. */
export const setLandingCopy = (next: CopyResolver<LandingCopyKey>) => {
  resolve = next;
};

/**
 * Landing copy for code that cannot call a hook (axios interceptors, upload
 * helpers). Serves the defaults until the site-content request lands once.
 */
export const landingCopy: CopyResolver<LandingCopyKey> = (key, vars) => resolve(key, vars);
