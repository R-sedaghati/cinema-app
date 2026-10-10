"use client";
/* eslint-disable @next/next/no-img-element */

import clsx from "clsx";
import { supportCardVisuals } from "@/lib/mock/support";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import type { ISiteContent } from "@/lib/services/admin/type";
import { textStyle } from "@/lib/utils/fontSize";
import Button from "../common/Button";

type Support = ISiteContent["support"] | undefined;

export const SupportIntro = ({ support, variant }: { support: Support; variant: string }) => {
  const copy = useLandingCopy();

  return (
    <section
      data-el="root"
      className={clsx("flex flex-col gap-10", variant === "start" ? "items-start text-start" : "items-center text-center")}
    >
      <h3 data-el="title" className="text-4xl font-h1-regular">
        {support?.title || copy("supportDefaultTitle")}
      </h3>
      {support?.description && (
        <p
          data-el="body"
          className="font-p1-regular whitespace-pre-line"
          style={textStyle(support.fontSize, support.color)}
        >
          {support.description}
        </p>
      )}
    </section>
  );
};

export const SupportCards = ({ support, variant }: { support: Support; variant: string }) => {
  const items = support?.items ?? [];
  const rows = variant === "rows";

  return (
    <section
      data-el="items"
      className={clsx(
        "flex w-full gap-10",
        rows ? "flex-col gap-4" : "flex-wrap justify-center md:justify-between items-center",
      )}
    >
      {items.map((item, index) => {
        // ponytail: three shipped visuals, cycled for any extra card the admin adds.
        const visual = supportCardVisuals[index % supportCardVisuals.length];

        return (
          <div
            key={index}
            data-card=""
            data-el="card"
            className={clsx(
              "flex bg-secondary-black border border-error-500/30 shadow-card rounded-4xl p-6",
              rows
                ? "w-full flex-col md:flex-row items-center gap-6"
                : "w-73 min-h-[530px] flex-col justify-between items-center gap-8",
            )}
          >
            <img
              data-el="image"
              src={item.image || visual.image}
              alt={item.title}
              width={216}
              height={160}
              className={clsx("w-auto object-contain", rows ? "h-24" : "h-40")}
            />
            <div className={clsx("flex flex-col gap-4", rows ? "flex-1 items-start" : "flex-1 items-center w-full")}>
              <h5 data-el="card-title" className="font-h3-bold">{item.title}</h5>
              <p
                data-el="card-text"
                className={clsx("font-p1-regular flex-1 text-zinc-400", !rows && "text-center")}
                style={textStyle(support?.fontSize, support?.color)}
              >
                {item.detail}
              </p>
              <div className="flex gap-2 self-start">
                {visual.footerIcon}
                <p data-el="card-meta">{item.footerText}</p>
              </div>
            </div>
            {item.buttonValue && (
              <Button className="rounded-full!" {...visual.buttonIcon}>
                <span data-el="button">{item.buttonValue}</span>
              </Button>
            )}
          </div>
        );
      })}
    </section>
  );
};
