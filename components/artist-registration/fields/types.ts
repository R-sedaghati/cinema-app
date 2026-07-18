import { IFormField } from "@/lib/services/admin/type";

export interface FieldProps {
  field: IFormField;
  value: unknown;
  onChange: (value: unknown) => void;
}
