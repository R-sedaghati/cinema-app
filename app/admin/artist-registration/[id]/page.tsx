"use client";

import ArtistRevisionDrawer from "@/components/admin/artist-registration/ArtistRevisionDrawer";
import ArtistStatus from "@/components/admin/artist-registration/ArtistStatus";
import { WorksSlider } from "@/components/media/WorksSlider";
import {
  useAdminArtistRetrieve,
  useAdminArtistStatusUpdate,
  useAdminFormSchema,
} from "@/lib/services/admin/hook";
import { EArtistRequestStatus, EFormFieldType, IFormField } from "@/lib/services/admin/type";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  Badge,
  Button,
  Card,
  Divider,
  FileUploader,
  Input,
} from "@dgshahr/ui-kit";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const resolveOptionLabels = (field: IFormField, value: unknown): string => {
  const values = Array.isArray(value) ? value : value !== undefined && value !== null ? [value] : [];
  const options = field.options ?? [];

  return values
    .map((v) => options.find((o) => o.value === String(v))?.label ?? String(v))
    .join("، ");
};

function ArtistDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: artistDetail } = useAdminArtistRetrieve(id);
  const data = artistDetail?.result;

  const { data: schemaData } = useAdminFormSchema(data?.categories?.[0]?.id);
  const steps = [...(schemaData?.result?.steps ?? [])].sort((a, b) => a.order - b.order);

  const { mutate, isPending } = useAdminArtistStatusUpdate(id);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const portfoliosFor = (fieldKey: string) =>
    data?.portfolios.filter((p) => p.fieldKey === fieldKey) ?? [];

  // Legacy portfolios saved before fieldKey existed — shown ungrouped.
  const legacyPhotoWorks =
    data?.portfolios
      .filter((p) => p.type === "IMAGE" && !p.fieldKey)
      .map((p) => ({ id: String(p.id), url: p.url })) ?? [];

  const legacyVideoWorks =
    data?.portfolios
      .filter((p) => p.type === "VIDEO" && !p.fieldKey)
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
              {steps.map((step) =>
                [...step.fields]
                  .sort((a, b) => a.order - b.order)
                  .filter((field) => field.type !== EFormFieldType.IMAGE && field.type !== EFormFieldType.VIDEO)
                  .map((field) => {
                    const value = data?.answers?.[field.key];
                    const display =
                      field.type === EFormFieldType.SELECT ||
                      field.type === EFormFieldType.RADIO ||
                      field.type === EFormFieldType.CHECKBOX
                        ? resolveOptionLabels(field, value)
                        : typeof value === "boolean"
                          ? value
                            ? "بله"
                            : "خیر"
                          : Array.isArray(value)
                            ? value.join("، ")
                            : ((value as string | number | undefined) ?? "");

                    return (
                      <Input
                        key={field.id}
                        placeholder={field.label}
                        labelContent={field.label}
                        value={display}
                      />
                    );
                  }),
              )}
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
              {(data?.categories ?? []).map((category) => (
                <Input
                  key={category.id}
                  wrapperClassName="w-1/3"
                  labelContent="زمینه فعالیت"
                  placeholder="زمینه فعالیت"
                  value={category.faName}
                />
              ))}
            </div>

            {steps.map((step) =>
              [...step.fields]
                .sort((a, b) => a.order - b.order)
                .filter((field) => field.type === EFormFieldType.IMAGE || field.type === EFormFieldType.VIDEO)
                .map((field) => (
                  <div key={field.id} className="flex flex-col gap-4">
                    <p className="font-h5-bold">{field.label}</p>
                    <WorksSlider
                      title=""
                      items={portfoliosFor(field.key).map((p) => ({ id: String(p.id), url: p.url }))}
                      variant={field.type === EFormFieldType.IMAGE ? "photo" : "video"}
                      className={field.type === EFormFieldType.IMAGE ? "w-1/4" : undefined}
                    />
                  </div>
                )),
            )}

            {(legacyPhotoWorks.length > 0 || legacyVideoWorks.length > 0) && (
              <>
                <div className="flex flex-col gap-4">
                  <p className="font-h5-bold">همه نمونه‌کارهای تصویری</p>
                  <WorksSlider
                    title=""
                    items={legacyPhotoWorks}
                    variant="photo"
                    className="w-1/4"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <p className="font-h5-bold">همه نمونه‌کارهای ویدئویی</p>
                  <WorksSlider title="" items={legacyVideoWorks} variant="video" />
                </div>
              </>
            )}
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
