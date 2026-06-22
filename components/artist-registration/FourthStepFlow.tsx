import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import { Card } from "@dgshahr/ui-kit";
import Button from "../common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const FourthStepFlow: React.FC<Props> = ({ onNext, onPrevious }) => {
  return (
    <Card wrapperClassName="w-3/4" className="pt-16">
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <div className="w-1 h-6 bg-error-500" />
              <p className="font-h5-bold">
                هزینه پرداخت ثبت‌نام نهایی در سایت آرشیو هنر
              </p>
            </div>
            <p className="font-p2-regular">
              هزینه یکبار برای همیشه در این دسته بندی میباشد
            </p>
          </div>
          <Card wrapperClassName="w-1/3">
            <div className="flex justify-between items-center">
              <p className="font-p2-medium">مبلغ قابل پرداخت</p>
              <div className="flex gap-1">
                <p className="font-p2-medium">
                  {convertEnNumberToFaNumberWithSeparation(200000)}
                </p>
                <p className="font-p2-medium">تومان</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            rightIcon={<ChevronRight />}
            className="rounded-full! px-10"
            onClick={onPrevious}
          >
            مرحله قبل
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className="rounded-full! px-10"
            onClick={onNext}
          >
            پرداخت و ثبت‌نام نهایی
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FourthStepFlow;
