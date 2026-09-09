import { HOME_SECTIONS, type HomeSectionKey } from "../constants/homeSections.ts";
import {
  orderedSections,
  resolveSections,
  type IResolvedSection,
  type ISectionConfig,
} from "./resolveSections.ts";

export type IHomeSectionConfig = ISectionConfig;
export type IResolvedHomeSection = IResolvedSection<HomeSectionKey>;

/** Stored config → the full ordered section list for the admin panel. */
export function orderedHomeSections(
  config?: IHomeSectionConfig[] | null,
): IResolvedHomeSection[] {
  return orderedSections(HOME_SECTIONS, config);
}

/** The sections the public page actually renders, in order. */
export function resolveHomeSections(
  config?: IHomeSectionConfig[] | null,
): IResolvedHomeSection[] {
  return resolveSections(HOME_SECTIONS, config);
}
