"use client";

import { ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface Props {
  field: any;
  label?: string;
  fieldState: any;
  disabled?: boolean;
  placeholder?: string;
  className?: ComponentProps<typeof Textarea>["className"];
}

export const TextareaInput = ({ field, fieldState, label, placeholder, className, disabled }: Props) => {
  return (
    <Field data-invalid={fieldState.invalid}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Textarea {...field} aria-invalid={fieldState.invalid} className={className} placeholder={placeholder} disabled={disabled} />
      {fieldState.error && <FieldError errors={[fieldState.error.message]} />}
    </Field>
  );
};
