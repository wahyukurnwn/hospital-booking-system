"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface Props {
  field: any;
  fieldState: any;
  label?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
}

export const RadioInput = ({ field, fieldState, label, options, disabled }: Props) => {
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}
      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1" disabled={disabled}>
        {options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="font-normal cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {fieldState.error && <FieldError errors={[fieldState.error.message]} />}
    </Field>
  );
};
