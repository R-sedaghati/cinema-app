import Badge from "@/components/common/Badge";
import { Divider } from "@dgshahr/ui-kit";

const Card = () => {
  return (
    <>
      <div className="min-h-21 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-zinc-400"> شنبه - ۱۴۰۲/۴/۲ - ۱۰:۳۰</p>
          <Badge value="پرداخت شده" color="success" />
        </div>
        <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
          <p className="line-clamp-1">
            مشاهده اطلاعات تماس پروفایل: نیما بنیادی
          </p>
          <p className="text-nowrap">80,000,000 تومان</p>
        </div>
      </div>
      <Divider type="horizontal" className="last:hidden" />
    </>
  );
};

export default Card;
