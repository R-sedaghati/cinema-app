import { supportItems } from "@/lib/mock/support";
import Image from "next/image";
import Button from "../common/Button";

const SupportCenter = () => {
  return (
    <section className="flex flex-col justify-center items-center gap-10">
      <h3 className="text-4xl font-h1-regular">مرکز پشتیبانی</h3>
      <p className="font-p1-regular">
        تیم پشتیبانی آرشیو هنر به‌صورت ۲۴ ساعته آماده‌ی پاسخ‌گویی و حل مشکلات
        شماست. هر زمان که نیاز داشتید، از طریق روش‌های مختلف می‌تونید با ما در
        تماس باشید.
      </p>
      <div className="flex flex-wrap justify-center md:justify-between w-full items-center gap-10">
        {supportItems.map((item) => (
          <div
            key={item.id}
            className="w-73 min-h-[530px] flex bg-secondary-black flex-col justify-between items-center gap-8 border border-error-500/30 shadow-card rounded-4xl p-6"
          >
            <Image src={item.image} alt={item.title} width={216} height={160} />
            <h5 className="font-h3-bold h-7.5">{item.title}</h5>
            <p className="font-p1-regular flex-1 text-zinc-400 text-center">
              {item.detail}
            </p>
            <div className="flex flex-col gap-2 items-start w-full">
              {item.footerList.map((footer) => (
                <div key={footer.des} className="flex gap-2">
                  {footer.icon}
                  <p>{footer.des}</p>
                </div>
              ))}
            </div>
            <Button className="rounded-full!" {...item.button}>
              {item.button.value}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupportCenter;
