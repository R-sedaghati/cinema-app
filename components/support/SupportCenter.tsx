"use client";

import { supportCardVisuals } from "@/lib/mock/support";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import Image from "next/image";
import Button from "../common/Button";

const SupportCenter = () => {
  const { data } = useUserSiteContent();
  const support = data?.result?.support;
  const items = support?.items ?? [];

  return (
    <section className="flex flex-col justify-center items-center gap-10">
      <h3 className="text-4xl font-h1-regular">
        {support?.title ?? "مرکز پشتیبانی"}
      </h3>
      <p className="font-p1-regular whitespace-pre-line">
        {support?.description}
      </p>
      <div className="flex flex-wrap justify-center md:justify-between w-full items-center gap-10">
        {items.map((item, index) => {
          const visual = supportCardVisuals[index];

          return (
            <div
              key={item.title}
              className="w-73 min-h-[530px] flex bg-secondary-black flex-col justify-between items-center gap-8 border border-error-500/30 shadow-card rounded-4xl p-6"
            >
              <Image
                src={visual.image}
                alt={item.title}
                width={216}
                height={160}
              />
              <h5 className="font-h3-bold h-7.5">{item.title}</h5>
              <p className="font-p1-regular flex-1 text-zinc-400 text-center">
                {item.detail}
              </p>
              <div className="flex flex-col gap-2 items-start w-full">
                <div className="flex gap-2">
                  {visual.footerIcon}
                  <p>{item.footerText}</p>
                </div>
              </div>
              <Button className="rounded-full!" {...visual.buttonIcon}>
                {item.buttonValue}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SupportCenter;
