"use client";

import { IArtistItem } from "@/lib/services/admin/type";
import { useState } from "react";
import CallDetailDrawer from "./CallDetailDrawer";
import Button from "@/components/common/Button";
import SuccessDrawer from "./SuccessDrawer";

const genderMap: Record<string, string> = { MAN: "مرد", WOMAN: "زن" };

const Aside = ({ artist }: { artist: IArtistItem }) => {
  const [openCallDetail, setOpenCallDetail] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const fullName = `${artist.user.firstName ?? ""} ${artist.user.lastName ?? ""}`.trim();

  return (
    <>
      <aside className="relative rounded-3xl border-2 h-fit border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur">
        <div className="absolute flex justify-center items-center rounded-full -top-16 left-1/2 border-2 border-error-600 h-40 w-40 -translate-x-1/2">
          {artist.user.avatar ? (
            <img
              src={artist.user.avatar}
              alt={fullName}
              className="h-36 w-36 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-zinc-700 text-5xl font-bold text-white shadow-xl">
              {fullName.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="mt-24 text-center">
          <h1 className="font-h1-regular text-3xl text-white">{fullName}</h1>
        </div>

        <div className="mt-10 space-y-4 text-base text-zinc-300">
          <div className="flex justify-between">
            <span className="text-zinc-500">استان</span>
            <span>{artist.user.province ?? "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">دسته‌بندی</span>
            <span>{artist.categories[0]?.faName ?? "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">جنسیت</span>
            <span>{genderMap[artist.user.gender] ?? "—"}</span>
          </div>

          {artist.user.dialect && (
            <div className="flex justify-between">
              <span className="text-zinc-500">لهجه</span>
              <span>{artist.user.dialect}</span>
            </div>
          )}
        </div>

        <div className="mt-10 space-y-4">
          <Button
            onClick={() => setOpenCallDetail(true)}
            size="small"
            isFullWidth
            className="rounded-full!"
          >
            مشاهده اطلاعات تماس
          </Button>
          <Button
            variant="outline"
            size="small"
            isFullWidth
            className="rounded-full! border-error-500!"
          >
            اشتراک گذاری
          </Button>
        </div>
      </aside>
      <CallDetailDrawer
        open={openCallDetail}
        setOpen={setOpenCallDetail}
        setOpenSuccess={setOpenSuccess}
      />
      <SuccessDrawer open={openSuccess} setOpen={setOpenSuccess} />
    </>
  );
};

export default Aside;
