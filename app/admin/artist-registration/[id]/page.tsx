"use client";

import ArtistRevisionDrawer from "@/components/admin/artist-registration/ArtistRevisionDrawer";
import ArtistStatus from "@/components/admin/artist-registration/ArtistStatus";
import { WorksSlider } from "@/components/media/WorksSlider";
import {
  useAdminArtistRetrieve,
  useAdminArtistStatusUpdate,
} from "@/lib/services/admin/hook";
import { EArtistRequestStatus } from "@/lib/services/admin/type";
import { ESampleType } from "@/lib/services/landing/type";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  Badge,
  Button,
  Card,
  Divider,
  FileUploader,
  Input,
  RadioButton,
  Textarea,
} from "@dgshahr/ui-kit";
import { Asterisk, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

function ArtistDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: artistDetail } = useAdminArtistRetrieve(id);
  const data = artistDetail?.result;

  const { mutate, isPending } = useAdminArtistStatusUpdate(id);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const photoWorks =
    data?.portfolios
      .filter((p) => p.type === "IMAGE")
      .map((p) => ({ id: String(p.id), url: p.url })) ?? [];

  const videoWorks =
    data?.portfolios
      .filter((p) => p.type === "VIDEO")
      .map((p) => ({ id: String(p.id), url: p.url })) ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <Button
          rightIcon={<ChevronRight />}
          onClick={() => router.push("/admin/artist-registration")}
          variant="text"
          color="gray"
        >
          {`فرم درخواست ${data?.user?.firstName}  ${data?.user?.lastName}`}
        </Button>
        <div className="flex gap-3 pe-3">
          <Button
            onClick={() => setIsDrawerOpen(true)}
            color="error"
            variant="outline"
          >
            ارسال اصلاحیه
          </Button>
          <Button
            onClick={() =>
              mutate(
                { status: EArtistRequestStatus.REJECTED },
                {
                  onSuccess: () => {
                    toast.success("با موفقیت تغییر کرد");
                    router.push("/admin/artist-registration");
                  },
                },
              )
            }
            isLoading={isPending}
            disabled={isPending}
            color="error"
            variant="outline"
          >
            موافقت نشد
          </Button>
          <Button
            onClick={() =>
              mutate(
                { status: EArtistRequestStatus.APPROVED },
                {
                  onSuccess: () => {
                    toast.success("با موفقیت تغییر کرد");
                    router.push("/admin/artist-registration");
                  },
                },
              )
            }
            isLoading={isPending}
            disabled={isPending}
            color="error"
          >
            تایید درخواست
          </Button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-6 bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-h3-bold text-error-500">اطلاعات کاربر</p>
              <div className="flex gap-2">
                <p className="font-h4-regular">وضعیت کاربر:</p>
                {data?.status && (
                  <ArtistStatus status={data.status} isSolid={false} />
                )}
              </div>
            </div>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="flex flex-col gap-1">
              <FileUploader
                mode="single"
                fileInputProps={{
                  className: "w-40!",
                  title: "عنوان",
                }}
                onChange={() => {}}
                previewProps={{
                  leftButton: false,
                }}
                files={{
                  src: data?.user?.avatar ?? "",
                }}
              />
              <div className="w-82.5 bg-primary-100 p-2 flex justify-center">
                <p className="text-primary-800">تصویر پروفایل</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="نام و نام خانوادگی"
                labelContent="نام و نام خانوادگی"
                value={`${data?.user?.firstName}  ${data?.user?.lastName}`}
              />
              <Input
                placeholder="شماره تماس"
                labelContent="شماره تماس"
                value={data?.user?.phoneNumber ?? ""}
              />
              <Input
                placeholder="ایمیل"
                labelContent="ایمیل"
                value={data?.user?.email ?? ""}
              />
              <Input
                placeholder="قد"
                labelContent="قد"
                value={data?.user?.height ?? ""}
              />
              <Input
                placeholder="وزن"
                labelContent="وزن"
                value={data?.user?.weight ?? ""}
              />
              <Input
                placeholder="زبان و گویش"
                labelContent="زبان و گویش"
                value={data?.user?.dialect ?? ""}
              />
              <Input
                placeholder="استان"
                labelContent="استان"
                value={data?.user?.province ?? ""}
              />
              <Input
                placeholder="شهر"
                labelContent="شهر"
                value={data?.user?.city ?? ""}
              />
              <Input
                placeholder="آدرس"
                labelContent="آدرس"
                value={data?.user?.address ?? ""}
              />
              <Input
                placeholder="کد پستی"
                labelContent="کد پستی"
                value={data?.user?.postalCode ?? ""}
              />
              <Input
                placeholder="تحصیلات"
                labelContent="تحصیلات"
                value={data?.user?.education ?? ""}
              />
              <Input
                placeholder="رشته تحصیلی"
                labelContent="رشته تحصیلی"
                value={data?.user?.major ?? ""}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">اطلاعات پرداختی</p>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="flex flex-col gap-3">
              <p className="font-p1-regular">وضعیت پرداخت</p>
              <div className="flex gap-3 items-center">
                <Badge
                  className="h-fit w-fit"
                  value={"پرداخت شده"}
                  type="twoTone"
                  color="success"
                  size="medium"
                />
                <Button variant="text" leftIcon={<ChevronLeft />} color="error">
                  مشاهده تراکنش
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">اطلاعات کاری</p>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="flex gap-5">
              <Input
                wrapperClassName="w-1/3"
                labelContent="زمینه فعالیت"
                placeholder="زمینه فعالیت"
                value={data?.categories?.at(0)?.faName}
              />
              <Input
                wrapperClassName="w-1/3"
                labelContent="زمینه فعالیت (دسته بندی دوم):"
                placeholder="زمینه فعالیت (دسته بندی دوم)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <p className="font-p2-medium">نمونه کار</p>
                <Asterisk size={12} className="text-error-500" />
              </div>
              <div className="flex gap-5">
                <RadioButton
                  label="دارم"
                  name="sample"
                  checked={data?.sampleType === ESampleType.HAS_SAMPLE}
                />

                <RadioButton
                  label="ندارم"
                  name="sample"
                  checked={data?.sampleType === ESampleType.NO_SAMPLE}
                />

                <RadioButton
                  label="تمایل به ضبط نمونه کار دارم"
                  name="sample"
                  checked={data?.sampleType === ESampleType.WANTS_RECORDING}
                />
              </div>
            </div>
            <Textarea
              labelContent="درباره من"
              placeholder="درباره من"
              value={data?.user?.aboutMe ?? ""}
            />
            <div className="flex flex-col gap-4">
              <p className="font-h5-bold">نمونه کارهای تصویری</p>
              <WorksSlider
                title=""
                items={photoWorks}
                variant="photo"
                className="w-1/4"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-h5-bold">نمونه کارهای ویدئویی</p>
              <WorksSlider title="" items={videoWorks} variant="video" />
            </div>
          </div>
        </Card>
      </div>

      <ArtistRevisionDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        id={id}
      />
    </div>
  );
}

export default withNoSSR(ArtistDetail);
