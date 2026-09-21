"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminCategoryUpdate,
  useAdminSiteContent,
  useAdminSiteContentUpdate,
} from "@/lib/services/admin/hook";
import {
  REGISTRATION_SECTIONS,
  type RegistrationScreen,
  type RegistrationSectionKey,
} from "@/lib/constants/registrationSections";
import {
  onScreen,
  orderedRegistrationSections,
  type IResolvedRegistrationSection,
} from "@/lib/utils/resolveRegistrationSections";
import { useHomeCategories } from "@/components/home/sections/useHomeCategories";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { sortByPriority } from "@/lib/utils/sortByPriority";
import { SectionList } from "@/components/admin/page-builder/SectionList";
import { CategoryOrderList } from "@/components/admin/page-builder/CategoryOrderList";
import SelectScreen from "@/components/artist-registration/sections/SelectScreen";
import withNoSSR from "@/lib/utils/withNoSSR";

const SCREEN_LABEL: Record<RegistrationScreen, string> = {
  select: "صفحه انتخاب فرم",
  flow: "صفحه تکمیل فرم",
};

function RegistrationBuilder() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();
  const { mutateAsync: updateCategory } = useAdminCategoryUpdate();
  const copy = useFormCopy();

  const [sections, setSections] = useState<IResolvedRegistrationSection[]>([]);
  const [dirty, setDirty] = useState(false);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setSections(orderedRegistrationSections(data.result.registrationSections));
  }, [data, dirty]);

  // Real categories, so the preview shows the admin their own forms.
  const categories = useHomeCategories();

  /** Ids in the order the admin just dragged them into, per list: `"root"` for the
   *  top-level categories, the parent's id for a subcategory list. A missing key means
   *  "trust the server". */
  const [orders, setOrders] = useState<Record<string, number[]>>({});
  const [savingOrder, setSavingOrder] = useState(false);

  const applyOrder = useCallback(
    <T extends { id: number }>(list: T[], parentId: number | null): T[] => {
      const ids = orders[parentId === null ? "root" : String(parentId)];
      if (!ids) return list;
      const byId = new Map(list.map((c) => [c.id, c]));
      const dragged = ids.map((id) => byId.get(id)).filter((c) => c !== undefined);
      // A category created elsewhere mid-drag isn't in `ids` — keep it, at the end.
      return [...dragged, ...list.filter((c) => !ids.includes(c.id))];
    },
    [orders],
  );

  const orderedCategories = useMemo(
    () => applyOrder(categories, null),
    [categories, applyOrder],
  );

  const items = useMemo(
    () =>
      orderedCategories.map((c) => ({
        id: c.id,
        title: c.faName,
        image: c.image,
      })),
    [orderedCategories],
  );

  const orderItems = useMemo(
    () =>
      orderedCategories.map((c) => ({
        id: c.id,
        faName: c.faName,
        image: c.image,
        children: applyOrder(sortByPriority(c.children ?? []), c.id).map((child) => ({
          id: child.id,
          faName: child.faName,
          image: child.image,
        })),
      })),
    [orderedCategories, applyOrder],
  );

  /** Writes `priority = index` back to every row of one list whose position actually
   *  changed. Comparing against `priority` (not the old index) also normalizes the
   *  null/duplicate priorities older rows carry — subcategories were all saved as null
   *  before they became orderable. */
  const handleReorder = async (nextIds: number[], parentId: number | null) => {
    setOrders((prev) => ({
      ...prev,
      [parentId === null ? "root" : String(parentId)]: nextIds,
    }));
    setSavingOrder(true);

    const siblings =
      parentId === null
        ? categories
        : (categories.find((c) => c.id === parentId)?.children ?? []);
    const byId = new Map(siblings.map((c) => [c.id, c]));

    try {
      await Promise.all(
        nextIds.flatMap((id, index) =>
          byId.get(id)?.priority === index
            ? []
            : [updateCategory({ id, payload: { priority: index } })],
        ),
      );
      await queryClient.invalidateQueries({ queryKey: ["applicationCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryList"] });
      setOrders({});
      toast.success("ترتیب زمینه فعالیت ذخیره شد");
    } catch {
      // The admin axios interceptor already toasted — just fall back to the server order.
      setOrders({});
    } finally {
      setSavingOrder(false);
    }
  };

  const selectSections = useMemo(() => onScreen(sections, "select"), [sections]);
  const flowSections = useMemo(() => onScreen(sections, "flow"), [sections]);

  /** Rows come back per screen; order only matters within one, so concat is safe. */
  const replaceScreen = (
    screen: RegistrationScreen,
    next: IResolvedRegistrationSection[],
  ) => {
    setSections((prev) =>
      screen === "select"
        ? [...next, ...onScreen(prev, "flow")]
        : [...onScreen(prev, "select"), ...next],
    );
    setDirty(true);
  };

  const handleSave = () => {
    save(
      { registrationSections: sections },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("صفحه ثبت‌نام ذخیره شد");
        },
        // The admin axios interceptor already toasts the failure.
      },
    );
  };

  const renderExtra = (key: RegistrationSectionKey) => {
    const meta = REGISTRATION_SECTIONS[key];

    return meta.manageLink ? (
      <Link href={meta.manageLink} className="text-sm text-primary-600 underline">
        {meta.manageLabel ?? "مدیریت محتوا"}
      </Link>
    ) : (
      <p className="text-sm text-gray-500">
        متن این بخش در فرم‌ساز هر دسته‌بندی ویرایش می‌شود.
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">صفحه‌ساز صفحه ثبت‌نام</h1>
          <p className="text-sm text-gray-500 mt-1">
            ترتیب و چیدمان بخش‌های صفحه ثبت‌نام هنرمند را تغییر دهید. ترتیب
            کارت‌ها را در «ترتیب زمینه فعالیت» جابه‌جا کنید؛ همان‌جا در «اولویت»
            دسته‌بندی‌ها ذخیره می‌شود.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr] items-start">
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-2 p-3">
            <p className="text-sm font-medium text-gray-700">
              {SCREEN_LABEL.select}
            </p>
            <SectionList
              catalog={REGISTRATION_SECTIONS}
              sections={selectSections}
              onChange={(next) => replaceScreen("select", next)}
              renderExtra={renderExtra}
            />
          </Card>

          <Card className="flex flex-col gap-2 p-3">
            <p className="text-sm font-medium text-gray-700">{SCREEN_LABEL.flow}</p>
            <SectionList
              catalog={REGISTRATION_SECTIONS}
              sections={flowSections}
              onChange={(next) => replaceScreen("flow", next)}
              renderExtra={renderExtra}
            />
          </Card>

          <Card className="flex flex-col gap-2 p-3">
            <p className="text-sm font-medium text-gray-700">
              ترتیب زمینه فعالیت
            </p>
            {/* Saves on drop, unlike the sections above — those ride the «ذخیره»
                button and go to a different endpoint. */}
            <p className="mb-1 text-xs text-gray-500">
              ترتیب کارت‌های مرحله اول، و زیر هر کارت ترتیب زیردسته‌های آن. با
              جابه‌جایی، خودکار ذخیره می‌شود.
            </p>
            <CategoryOrderList
              items={orderItems}
              onReorder={handleReorder}
              isSaving={savingOrder}
            />
          </Card>
        </div>

        <Card className="p-3">
          <p className="mb-2 text-sm text-gray-500">
            پیش‌نمایش {SCREEN_LABEL.select}
          </p>
          {/* pointer-events-none: the real sections navigate — the preview must
              never take the panel with it. */}
          <div
            dir="rtl"
            className="pointer-events-none select-none max-w-[900px] overflow-hidden rounded-2xl bg-zinc-950 py-4 text-zinc-100"
          >
            <SelectScreen
              sections={selectSections.filter((s) => !s.hidden)}
              items={items}
              copy={copy}
              onSelect={() => undefined}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            {SCREEN_LABEL.flow} پیش‌نمایش ندارد — به یک فرم انتخاب‌شده نیاز دارد.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(RegistrationBuilder);
