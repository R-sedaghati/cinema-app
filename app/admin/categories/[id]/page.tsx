"use client";

import {
  useAdminCategoryRetrieve,
  useAdminCategoryUpdate,
} from "@/lib/services/admin/hook";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  Button,
  Card,
  Divider,
  Input,
  Switch,
} from "@dgshahr/ui-kit";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function CategoryDetail() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const { data: retriveDate } = useAdminCategoryRetrieve(id);
  const data = retriveDate?.result;

  const { mutate, isPending } = useAdminCategoryUpdate();

  const [faName, setFaName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!data) return;

    setFaName(data.faName);
    setDescription(data.description ?? "");
    setIsActive(data.isActive);
    setPriority(data.priority);
  }, [data]);

  const handleSubmit = () => {
    mutate(
      {
        id,
        payload: {
          faName,
          isActive,
          description,
          priority,
        },
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت انجام شد");
          router.push("/admin/categories");
        },
      },
    );
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          onClick={() => router.push("/admin/categories")}
          variant="text"
          rightIcon={<ChevronRight />}
          color="gray"
        >
          {`دسته‌بندی ${data?.faName}`}
        </Button>
      </div>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <div className="flex flex-col gap-5 pt-6 px-4 h-full bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">
              اطلاعات دسته‌بندی صحنه و لباس
            </p>
            <Divider
              className="mb-5"
              color="gray"
              size="thin"
              type="horizontal"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Input
                labelContent="نام دسته ‌بندی"
                placeholder="نام دسته ‌بندی"
                wrapperClassName="w-full"
                value={faName}
                onChange={(e) => setFaName(e.target.value)}
              />
              {!data?.parent && (
                <Input
                  labelContent="اولویت"
                  placeholder="اولویت"
                  wrapperClassName="w-full"
                  value={priority ?? ""}
                  type="number"
                  onChange={(e) =>
                    setPriority(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              )}
              <div className="flex flex-col gap-3">
                <p className="font-p1-regular text-gray-500">
                  تعداد درخواست‌‌ها
                </p>
                <p className="font-p1-regular text-gray-800">
                  {data?.artistRequestsCount}
                </p>
              </div>
              <Switch
                label="وضعیت"
                checked={isActive}
                onChange={(checked) => setIsActive(checked)}
              />
              <Input
                labelContent="توضیحات"
                placeholder="توضیحات"
                wrapperClassName="w-full md:col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Card>
        {!data?.parent && (
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="font-h3-bold text-error-500">فرم ثبت‌نام دسته‌بندی</p>
                <Button
                  color="error"
                  variant="outline"
                  onClick={() => router.push(`/admin/categories/${id}/form-builder`)}
                >
                  مدیریت فرم
                </Button>
              </div>
              <Divider color="gray" size="thin" type="horizontal" />
              <p className="font-p2-regular text-gray-500">
                مراحل و فیلدهای فرم ثبت‌نام این دسته‌بندی از صفحه مدیریت فرم قابل تعریف است.
              </p>
            </div>
          </Card>
        )}
        <Card>
          <div className="flex flex-col gap-5">
            <p className="font-h3-bold text-error-500">پرداخت</p>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
              <Input
                labelContent="مبلغ پرداختی کاربر"
                placeholder="مبلغ پرداختی کاربر"
                postfix="تومان"
                wrapperClassName="w-1/3"
              />
            </div>
            <div className="flex justify-end">
              <Button
                color="error"
                disabled={isPending}
                isLoading={isPending}
                onClick={handleSubmit}
              >
                ذخیره تغییرات
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default withNoSSR(CategoryDetail);
