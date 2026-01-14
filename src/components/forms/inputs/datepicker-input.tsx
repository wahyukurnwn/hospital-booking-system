"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface Props {
  field: any;
  fieldState: any;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePickerInput = ({ field, fieldState, label, placeholder, disabled }: Props) => {
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <Button disabled={disabled} variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
            {field.value ? format(field.value, "PPP") : <span>{placeholder || "Pick a date"}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} autoFocus />
        </PopoverContent>
      </Popover>
      {fieldState.error && <FieldError errors={[fieldState.error.message]} />}
    </Field>
  );
};
