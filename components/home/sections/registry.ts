import type { HomeSectionKey } from "@/lib/constants/homeSections";
import { BannerSliderSection } from "./BannerSliderSection";
import { SearchHeaderSection } from "./SearchHeaderSection";
import { CategoryChipsSection } from "./CategoryChipsSection";
import { MainVideoSection } from "./MainVideoSection";
import { RegistrationRowSection } from "./RegistrationRowSection";
import { ArtistGridSection } from "./ArtistGridSection";
import { TutorialsSection } from "./TutorialsSection";
import { CtaCardsSection } from "./CtaCardsSection";

export interface HomeSectionProps {
  /** Layout variant key, already resolved against the catalog. */
  variant?: string;
}

/** Key → component, mirroring `HOME_SECTIONS`. Kept separate from the catalog
 *  constants so the admin panel can read the metadata without importing every
 *  section component. */
export const HOME_SECTION_COMPONENTS: Record<
  HomeSectionKey,
  React.FC<HomeSectionProps>
> = {
  bannerSlider: BannerSliderSection,
  searchHeader: SearchHeaderSection,
  categoryChips: CategoryChipsSection,
  mainVideo: MainVideoSection,
  registrationRow: RegistrationRowSection,
  artistGrid: ArtistGridSection,
  tutorials: TutorialsSection,
  ctaCards: CtaCardsSection,
};
