"use client";

import { Select } from "@dgshahr/ui-kit";
import { useEffect, useMemo } from "react";
import { EFormFieldType } from "@/lib/services/admin/type";
import { useUserCityList, useUserProvinceList } from "@/lib/services/landing/hook";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { FieldProps } from "./types";

const SelectField: React.FC<FieldProps> = ({ field, value, onChange, provinceKey }) => {
  const isProvince = field.type === EFormFieldType.SELECT_PROVINCE;
  const isCity = field.type === EFormFieldType.SELECT_CITY;

  const selectedProvince = useArtistRegistrationStore((s) =>
    provinceKey ? (s.answers[provinceKey] as string | undefined) : undefined,
  );

  const { data: provinces, isFetching: provincesFetching } = useUserProvinceList(
    undefined,
    isProvince || isCity,
  );
  const provinceId =
    provinces?.result?.find((p) => p.name === selectedProvince)?.id ?? 0;
  // A city field is only genuinely unusable once the province list has arrived and still
  // does not name the answer's province — before that it is merely not loaded yet.
  const isProvinceUnresolved = isCity && !provinceId && !provincesFetching;
  const { data: cities, isFetching: citiesFetching } = useUserCityList(
    isCity ? provinceId : 0,
  );

  const cityNames = useMemo(() => cities?.result ?? [], [cities]);

  // province changed under it: the previously picked city belongs to another province
  useEffect(() => {
    // While the list is in flight it still holds the previous province's cities — clearing
    // against it would wipe a city that was just hydrated into an edit.
    // Same for the province list: clearing while it is in flight wipes a city that was
    // just hydrated into an edit.
    if (!isCity || !value || !cityNames.length || citiesFetching) return;
    if (provincesFetching || !provinceId) return;
    if (!cityNames.some((c) => c.name === value)) onChange("");
  }, [isCity, value, cityNames, citiesFetching, provincesFetching, provinceId, onChange]);

  const options = isProvince
    ? (provinces?.result ?? []).map((p) => ({ label: p.name, value: p.name }))
    : isCity
      ? cityNames.map((c) => ({ label: c.name, value: c.name }))
      : (field.options ?? []);

  return (
    <Select
      inputProps={{
        labelContent: field.label,
        placeholder: field.placeholder ?? field.label,
        required: field.required,
      }}
      disabled={isProvinceUnresolved}
      searchable={isProvince || isCity}
      value={(value as string) || null}
      options={options}
      wrapperClassName="w-full"
      // Single mode fires onChange even for the already-selected option. Toggling it off
      // there would silently blank a required answer, so a re-pick is a no-op instead.
      onChange={(selected) =>
        selected === value ? undefined : onChange(selected ?? "")
      }
      mode="single"
    />
  );
};

export default SelectField;
