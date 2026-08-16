import { IFormField } from "@/lib/services/admin/type";

export interface FieldProps {
  field: IFormField;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Key of the form's SELECT_PROVINCE field — a SELECT_CITY field lists that province's cities. */
  provinceKey?: string;
}
