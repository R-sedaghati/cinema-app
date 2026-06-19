import { benefitItems } from "@/lib/mock/about";
import Image from "next/image";

const Benefits = () => {
  return (
    <section className="w-full flex flex-wrap justify-center gap-8 items-center">
      {benefitItems.map((item) => (
        <div
          key={item.title}
          className="w-73 min-h-[560px] flex flex-col items-center gap-8 
             bg-secondary-black 
             border border-error-500/30 
             shadow-card 
             rounded-4xl 
             text-base
             p-6
             text-right"
        >
          <Image src={item.image} alt={item.title} width={216} height={160} />

          <h5 className="font-h3-bold text-white">{item.title}</h5>

          <div className="font-p1-regular text-zinc-400 text-base">
            {item.desc}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Benefits;
