import { EFormFieldType } from "../services/admin/type.ts";
import type { IFormField } from "../services/admin/type.ts";
import convertGregorianTimeToShamsiTime from "./convertGregorianTimeToShamsiTime.ts";

export interface AnswerText {
  yes: string;
  no: string;
  empty: string;
  sep: string;
}

const OPTION_TYPES = new Set([
  EFormFieldType.SELECT,
  EFormFieldType.RADIO,
  EFormFieldType.CHECKBOX,
]);

/**
 * Read-only text for a non-file answer. Options store their `value` and dates an ISO string,
 * neither of which is what the person picked on screen.
 */
export const formatAnswer = (
  field: Pick<IFormField, "type" | "options">,
  value: unknown,
  t: AnswerText,
): string => {
  if (value === undefined || value === null || value === "") return t.empty;
  if (typeof value === "boolean") return value ? t.yes : t.no;

  const values = Array.isArray(value) ? value : [value];
  if (!values.length) return t.empty;

  if (OPTION_TYPES.has(field.type)) {
    const options = field.options ?? [];
    return values
      .map((v) => options.find((o) => o.value === String(v))?.label ?? String(v))
      .join(t.sep);
  }

  if (field.type === EFormFieldType.DATE) {
    return convertGregorianTimeToShamsiTime(String(value), false) || String(value);
  }

  return values.map(String).join(t.sep);
};
