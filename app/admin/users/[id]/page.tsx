"use client";

import ArtistStatus from "@/components/admin/artist-registration/ArtistStatus";
import { useAdminUserRequest } from "@/lib/services/admin/hook";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  Badge,
  Button,
  Card,
  Divider,
  FileUploader,
  Input,
} from "@dgshahr/ui-kit";
import { useParams, useRouter } from "next/navigation";
import React from "react";

function ArtistDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: userDetail } = useAdminUserRequest(id);
  const data = userDetail?.result?.at(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="h-10" />
      <div className="p-4 flex flex-col gap-6 bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-h3-bold text-error-500">اطلاعات کاربر</p>
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
                value={(data?.answers?.height as string | number | undefined) ?? ""}
              />
              <Input
                placeholder="وزن"
                labelContent="وزن"
                value={(data?.answers?.weight as string | number | undefined) ?? ""}
              />
              <Input
                placeholder="زبان و گویش"
                labelContent="زبان و گویش"
                value={(data?.answers?.dialect as string | undefined) ?? ""}
              />
              <Input
                placeholder="استان"
                labelContent="استان"
                value={(data?.answers?.province as string | undefined) ?? ""}
              />
              <Input
                placeholder="شهر"
                labelContent="شهر"
                value={(data?.answers?.city as string | undefined) ?? ""}
              />
              <Input
                placeholder="آدرس"
                labelContent="آدرس"
                value={(data?.answers?.address as string | undefined) ?? ""}
              />
              <Input
                placeholder="کد پستی"
                labelContent="کد پستی"
                value={(data?.answers?.postalCode as string | undefined) ?? ""}
              />
              <Input
                placeholder="تحصیلات"
                labelContent="تحصیلات"
                value={(data?.answers?.education as string | undefined) ?? ""}
              />
              <Input
                placeholder="رشته تحصیلی"
                labelContent="رشته تحصیلی"
                value={(data?.answers?.major as string | undefined) ?? ""}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">فرم‌های درخواستی</p>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="flex flex-col gap-3">
              {userDetail?.result?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-5 border border-solid border-gray-300 rounded-xl"
                >
                  <p className="font-p1-regular">
                    {item?.categories?.at(0)?.faName}
                  </p>
                  {item.trackingCode ? (
                    <Badge type="twoTone" color="success" value="پرداخت شده" />
                  ) : (
                    <Badge type="twoTone" color="error" value="پرداخت نشده" />
                  )}
                  <p className="font-p1-regular">
                    {item?.createdAt &&
                      convertGregorianTimeToShamsiTime(item.createdAt)}
                  </p>
                  <ArtistStatus status={item.status} isSolid={false} />
                  <Button
                    onClick={() =>
                      router.push(`/admin/artist-registration/${item.id}`)
                    }
                    color="error"
                    variant="outline"
                  >
                    مشاهده فرم درخواست
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(ArtistDetail);
