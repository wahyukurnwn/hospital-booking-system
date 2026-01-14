"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface Props {
  field: any;
  fieldState: any;
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string }[]; // Modular options
  disabled?: boolean;
}

export const SelectInput = ({ field, fieldState, label, placeholder, options, disabled }: Props) => {
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.error && <FieldError errors={[fieldState.error.message]} />}
    </Field>
  );
};
