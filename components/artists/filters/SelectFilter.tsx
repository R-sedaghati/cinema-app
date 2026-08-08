"use client";

import { ChevronDown } from "lucide-react";
import { Chip, Select as UiKitSelect } from "@dgshahr/ui-kit";
import { chevronCn } from "@/lib/utils/chevronCn";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import type { IArtistFilterDescriptor } from "@/lib/services/landing/type";

export function SelectFilter({
  descriptor,
  values,
  onChange,
}: Readonly<{
  descriptor: Extract<IArtistFilterDescriptor, { kind: "select" }>;
  values: string[];
  onChange: (values: string[]) => void;
}>) {
  const isMobile = useIsMobile();

  const shared = {
    mode: "multiple" as const,
    value: values,
    onChange: (value: string[]) => onChange(value),
    searchable: descriptor.options.length > 8,
    optionsTitle: descriptor.label,
    options: descriptor.options.map((option) => ({
      label: option.label,
      value: option.value,
    })),
    // No `clickable` here: PickerWrapper already wraps customInput in its own <button>,
    // and a nested button is invalid HTML (React reports it as a hydration error).
    customInput: (isOpen: boolean) => (
      <Chip
        label={descriptor.label}
        badgeNumber={values.length || undefined}
        filled={isOpen || values.length > 0}
        leftIcon={<ChevronDown className={chevronCn(isOpen)} />}
      />
    ),
  };

  // The kit's own drawer mode replaces what used to be a hand-rolled mobile <Drawer>.
  // Explicit type arg: spreading `shared` otherwise infers T from `value` as string[].
  return isMobile ? (
    <UiKitSelect<string>
      {...shared}
      dropdownType="drawer"
      drawerProps={{ header: { title: descriptor.label, haveCloseIcon: true } }}
    />
  ) : (
    <UiKitSelect<string> {...shared} />
  );
}
