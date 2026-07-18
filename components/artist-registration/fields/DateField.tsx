"use client";

import { Datepicker } from "@dgshahr/ui-kit";
import { FieldProps } from "./types";

const DateField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <Datepicker
    inputProps={{
      labelContent: field.label,
      placeholder: field.placeholder ?? field.label,
      required: field.required,
    }}
    dropdownType="drawer"
    showSubmitButton
    drawerProps={{
      width: "435px",
      position: "center",
      maskClassName: "!z-[99999999]",
      header: {
        title: field.label,
        haveCloseIcon: true,
      },
    }}
    wrapperClassName="w-full"
    value={value ? new Date(value as string) : null}
    onChange={(dt) => onChange(dt ? dt.toISOString() : "")}
  />
);

export default DateField;
