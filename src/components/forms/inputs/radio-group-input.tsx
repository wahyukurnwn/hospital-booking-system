"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  options?: Option[];
  disabled?: boolean;
}

export function RadioInput({ field, fieldState, label, options, disabled }: Props) {
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}

      <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col space-y-1" disabled={disabled}>
        {options?.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-3">
            <RadioGroupItem value={opt.value} id={opt.value} />
            <Label htmlFor={opt.value} className="cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {fieldState.error && <FieldError errors={[{ message: fieldState.error.message }]} />}
    </Field>
  );
}
