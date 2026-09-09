import {
  REGISTRATION_SECTIONS,
  type RegistrationScreen,
  type RegistrationSectionKey,
} from "../constants/registrationSections.ts";
import {
  orderedSections,
  resolveSections,
  type IResolvedSection,
  type ISectionConfig,
} from "./resolveSections.ts";

export type IRegistrationSectionConfig = ISectionConfig;
export type IResolvedRegistrationSection = IResolvedSection<RegistrationSectionKey>;

/** Stored config → the full ordered section list for the admin panel. */
export function orderedRegistrationSections(
  config?: IRegistrationSectionConfig[] | null,
): IResolvedRegistrationSection[] {
  return orderedSections(REGISTRATION_SECTIONS, config);
}

/** The sections the public page actually renders, in order. */
export function resolveRegistrationSections(
  config?: IRegistrationSectionConfig[] | null,
): IResolvedRegistrationSection[] {
  return resolveSections(REGISTRATION_SECTIONS, config);
}

/** Narrow a resolved list to one screen — ordering is per-screen. */
export const onScreen = (
  sections: IResolvedRegistrationSection[],
  screen: RegistrationScreen,
) => sections.filter((s) => REGISTRATION_SECTIONS[s.key].screen === screen);
