"use client";

import { Select } from "@dgshahr/ui-kit";
import { useEffect } from "react";
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

  const { data: provinces } = useUserProvinceList(undefined, isProvince || isCity);
  const provinceId =
    provinces?.result?.find((p) => p.name === selectedProvince)?.id ?? 0;
  const { data: cities } = useUserCityList(isCity ? provinceId : 0);

  const cityNames = cities?.result ?? [];

  // province changed under it: the previously picked city belongs to another province
  useEffect(() => {
    if (!isCity || !value || !cityNames.length) return;
    if (!cityNames.some((c) => c.name === value)) onChange("");
  }, [isCity, value, cityNames]);

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
      disabled={isCity && !provinceId}
      searchable={isProvince || isCity}
      value={(value as string) || null}
      options={options}
      wrapperClassName="w-full"
      onChange={(selected) => onChange(selected ?? "")}
      mode="single"
    />
  );
};

export default SelectField;
