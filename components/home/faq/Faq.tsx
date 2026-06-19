import { AccordionGroup, AccordionItem } from "@dgshahr/ui-kit";
import { faqMock } from "@/lib/mock/faq";

export const Faq = () => {
  return (
    <div className="flex relative flex-col justify-center items-center gap-10 pb-28">
      <h3 className="font-h1-bold">سوالات متداول</h3>
      <AccordionGroup className="gap-4" defaultActiveKey={"f1"}>
        {faqMock.map((item) => (
          <AccordionItem
            key={item.id}
            accordionKey={item.id}
            className="bg-secondary-black! rounded-lg border border-zinc-700 [&>div:nth-child(3)]:bg-transparent"
            titleClassName="text-error-500! text-right!"
            contentClassName="text-zinc-100!"
            title={item.question}
          >
            {item.answer}
          </AccordionItem>
        ))}
      </AccordionGroup>
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -bottom-44 -right-96 -z-1
        bg-radial-primary"
      />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 bottom-24 -left-96 -z-1
        bg-radial-primary"
      />
    </div>
  );
};
