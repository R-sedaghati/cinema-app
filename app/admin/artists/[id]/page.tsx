"use client";

import ArtistStatus from "@/components/admin/artists/ArtistStatus";
import { useAdminArtistRetrieve } from "@/lib/services/admin/hook";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  Badge,
  Button,
  Card,
  Divider,
  FileUploader,
  Input,
  Textarea,
} from "@dgshahr/ui-kit";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

function ArtistDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data: artistDetail } = useAdminArtistRetrieve(id);
  const data = artistDetail?.result;

  const imagePortfolios = data?.portfolios?.filter(
    (item) => item.type === "IMAGE",
  );

  const videoPortfolios = data?.portfolios?.filter(
    (item) => item.type === "VIDEO",
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end w-full gap-3 px-3">
        <Button variant="outline" color="error">
          موافقت نشد
        </Button>
        <Button variant="primary" color="error">
          تایید پروفایل
        </Button>
      </div>
      <Divider color="gray" size="thin" type="horizontal" />
      <div className="p-4 flex flex-col gap-6 bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-h3-bold text-error-500">اطلاعات کاربر</p>
              <div className="flex gap-2">
                <p className="font-h4-regular">وضعیت کاربر:</p>
                {data?.status && <ArtistStatus status={data.status} />}
              </div>
            </div>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <p className="font-h3-bold text-error-500">اطلاعات کاری</p>
            <Divider color="gray" size="thin" type="horizontal" />
            <Textarea
              labelContent="درباره من"
              placeholder="درباره من"
              value={data?.user?.aboutMe ?? ""}
            />
            <div className="flex flex-col gap-4">
              <p className="font-h5-bold">نمونه کارهای تصویری</p>
              <div className="flex gap-3 flex-wrap">
                {imagePortfolios?.map((item) => (
                  <FileUploader
                    key={item.id}
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
                      src: item.url ?? "",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-h5-bold">نمونه کارهای ویدئویی</p>
              <div className="flex gap-3 flex-wrap">
                {videoPortfolios?.map((item) => (
                  <FileUploader
                    key={item.id}
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
                      src: item.url ?? "",
                    }}
                  />
                ))}
              </div>
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
      </div>
    </div>
  );
}

export default withNoSSR(ArtistDetail);
