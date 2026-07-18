"use client";

import { benefitImages } from "@/lib/mock/about";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import Image from "next/image";

const Benefits = () => {
  const { data } = useUserSiteContent();
  const items = data?.result?.benefits?.items ?? [];

  return (
    <section className="w-full flex flex-col md:flex-row justify-center gap-8 items-center">
      {items.map((item, index) => (
        <div
          key={item.title}
          className="w-full md:w-73! min-h-[560px] flex flex-col items-center gap-8
             bg-secondary-black
             border border-error-500/30
             shadow-card
             rounded-4xl
             text-base
             p-6
             text-right"
        >
          <Image
            src={benefitImages[index]}
            alt={item.title}
            width={216}
            height={160}
          />

          <h5 className="font-h3-bold text-white">{item.title}</h5>

          <div className="font-p1-regular text-zinc-400 text-base whitespace-pre-line">
            {item.desc}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Benefits;
