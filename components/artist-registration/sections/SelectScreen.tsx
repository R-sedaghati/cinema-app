"use client";

import clsx from "clsx";
import { Card } from "@dgshahr/ui-kit";
import { isDesktop } from "react-device-detect";
import { REGISTRATION_SECTIONS } from "@/lib/constants/registrationSections";
import type { IResolvedRegistrationSection } from "@/lib/utils/resolveRegistrationSections";
import type { CopyFn } from "@/lib/utils/formCopy";
import BackLinkSection from "./BackLinkSection";
import PromptSection from "./PromptSection";
import CategoryCardsSection, {
  type RegistrationCategory,
} from "./CategoryCardsSection";

interface Props {
  /** Already resolved and filtered to the `select` screen, in render order. */
  sections: IResolvedRegistrationSection[];
  items: RegistrationCategory[];
  copy: CopyFn;
  onSelect: (id: number, title: string, existingRequestId?: number) => void;
}

/**
 * The category-picking screen (`step === 0`), assembled from the admin config.
 * Shared with the admin builder's preview, so both render the same thing.
 */
const SelectScreen: React.FC<Props> = ({ sections, items, copy, onSelect }) => {
  const render = (section: IResolvedRegistrationSection) => {
    switch (section.key) {
      case "backLink":
        return <BackLinkSection key={section.key} copy={copy} />;
      case "prompt":
        return (
          <PromptSection key={section.key} copy={copy} variant={section.variant} />
        );
      case "categoryCards":
        return (
          <CategoryCardsSection
            key={section.key}
            items={items}
            copy={copy}
            variant={section.variant}
            onSelect={onSelect}
          />
        );
      default:
        return null;
    }
  };

  // Consecutive in-card sections share one Card, so reordering never splits the
  // panel into a stack of half-empty boxes.
  const groups: IResolvedRegistrationSection[][] = [];
  for (const section of sections) {
    const inCard = REGISTRATION_SECTIONS[section.key].inCard;
    const last = groups.at(-1);
    const lastInCard = last && REGISTRATION_SECTIONS[last[0].key].inCard;

    if (last && lastInCard === inCard && inCard) last.push(section);
    else groups.push([section]);
  }

  return (
    <>
      {groups.map((group) =>
        REGISTRATION_SECTIONS[group[0].key].inCard ? (
          <Card
            key={group[0].key}
            wrapperClassName={clsx("w-[90%] mx-auto mt-4", isDesktop && "w-4/5 mt-0")}
            className={clsx("p-4", isDesktop && "p-6!")}
          >
            <div className="flex flex-col gap-3 items-center">
              {group.map(render)}
            </div>
          </Card>
        ) : (
          <div key={group[0].key}>{group.map(render)}</div>
        ),
      )}
    </>
  );
};

export default SelectScreen;
