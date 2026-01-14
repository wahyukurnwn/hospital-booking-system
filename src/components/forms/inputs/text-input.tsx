"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface Props {
  field: any;
  label?: string;
  fieldState: any;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const TextInput = ({ field, fieldState, label, placeholder, type, disabled }: Props) => {
  return (
    <Field data-invalid={fieldState.invalid}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Input {...field} aria-invalid={fieldState.invalid} placeholder={placeholder} type={type} disabled={disabled} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};
