"use client";

import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import { Card } from "@dgshahr/ui-kit";
import Button from "../common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import {
  useUpdateUserArtistRequest,
  useUserCreateArtistRequest,
} from "@/lib/services/landing/hook";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const PAYMENT_AMOUNT = 200000;

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const FourthStepFlow: React.FC<Props> = ({ onPrevious }) => {
  const store = useArtistRegistrationStore();
  const router = useRouter();
  const { mutate: create, isPending: isCreating } = useUserCreateArtistRequest();
  const { mutate: update, isPending: isUpdating } = useUpdateUserArtistRequest();
  const isPending = isCreating || isUpdating;

  const formPayload = {
    categoryIds: store.categoryId,
    firstName: store.firstName || undefined,
    lastName: store.lastName || undefined,
    height: store.height ?? undefined,
    weight: store.weight ?? undefined,
    language: store.language || undefined,
    dialect: store.dialect || undefined,
    email: store.email || undefined,
    address: store.address || undefined,
    province: store.province || undefined,
    city: store.city || undefined,
    postalCode: store.postalCode || undefined,
    education: store.education || undefined,
    major: store.major || undefined,
    avatar: store.avatar || undefined,
    birthDate: store.birthDate || undefined,
    gender: store.gender || undefined,
    aboutMe: store.aboutMe || undefined,
    portfolios: store.portfolios.length ? store.portfolios : undefined,
  };

  const handleSubmit = () => {
    if (store.editId) {
      update(
        { id: store.editId, ...formPayload },
        {
          onSuccess: () => {
            toast.success("فرم با موفقیت ویرایش شد");
            store.reset();
            router.push("/profile");
          },
          onError: () => toast.error("خطا در ویرایش فرم"),
        },
      );
    } else {
      create(formPayload, {
        onSuccess: (res) => {
          window.location.href = `http://api.archivehonar.ir/api/user/purchase/?amount=${PAYMENT_AMOUNT}&requestId=${res.result.artistRequestId}`;
        },
      });
    }
  };

  return (
    <Card wrapperClassName="w-3/4" className="pt-16">
      <div className="flex flex-col gap-10">
        {!store.editId && (
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
                    {convertEnNumberToFaNumberWithSeparation(PAYMENT_AMOUNT)}
                  </p>
                  <p className="font-p2-medium">تومان</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {store.editId && (
          <div className="flex gap-2 items-center">
            <div className="w-1 h-6 bg-error-500" />
            <p className="font-h5-bold">بررسی و ثبت تغییرات فرم</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            rightIcon={<ChevronRight />}
            className="rounded-full! px-10"
            onClick={onPrevious}
            disabled={isPending}
          >
            مرحله قبل
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className="rounded-full! px-10"
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={isPending}
          >
            {store.editId ? "ثبت تغییرات" : "پرداخت و ثبت‌نام نهایی"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FourthStepFlow;
