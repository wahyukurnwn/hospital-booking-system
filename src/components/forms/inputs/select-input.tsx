"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface Props {
  field: ControllerRenderProps<any, any>;
  fieldState: ControllerFieldState;
  label?: string;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
}

export function SelectInput({ field, fieldState, label, placeholder, options, disabled }: Props) {
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}

      <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {fieldState.error && <FieldError errors={[{ message: fieldState.error.message }]} />}
    </Field>
  );
}
