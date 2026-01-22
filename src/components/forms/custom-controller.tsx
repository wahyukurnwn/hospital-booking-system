"use client";

import { Control, Controller, FieldValues, Path, ControllerRenderProps, ControllerFieldState } from "react-hook-form";
import { FieldType } from "@/constants/types";

import { TextInput } from "./inputs/text-input";
import { TextareaInput } from "./inputs/textarea-input";
import { DatePickerInput } from "./inputs/datepicker-input";
import { SlotPickerInput } from "./inputs/slot-picker-input";
import { FileUploadInput } from "./inputs/file-upload";
import { SelectInput } from "./inputs/select-input";
import { RadioInput } from "./inputs/radio-group-input";
import { TimeSlot } from "@/features/appointment/hooks/use-booking-slots";

interface Option {
  label: string;
  value: string;
}

interface BaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface CustomControllerProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
  fieldType: FieldType;
  options?: Option[] | TimeSlot[];
}

function assertNever(x: never): never {
  throw new Error(`Unhandled field type: ${x}`);
}

export function CustomController<T extends FieldValues>({ control, name, fieldType, ...props }: CustomControllerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const common = {
          field,
          fieldState,
          label: props.label,
          placeholder: props.placeholder,
          disabled: props.disabled,
        };

        switch (fieldType) {
          case FieldType.TEXT:
          case FieldType.EMAIL:
          case FieldType.PASSWORD:
          case FieldType.PHONE:
            return <TextInput {...common} type={fieldType} />;

          case FieldType.TEXTAREA:
            return <TextareaInput {...common} />;

          case FieldType.SELECT:
            return <SelectInput {...common} options={props.options as Option[]} />;

          case FieldType.RADIO:
            return <RadioInput {...common} options={props.options as Option[]} />;

          case FieldType.DATE:
            return <DatePickerInput {...common} />;

          case FieldType.SLOT:
            return <SlotPickerInput {...common} options={props.options as TimeSlot[]} />;

          case FieldType.FILE:
            return <FileUploadInput {...common} />;

          default:
            return assertNever(fieldType);
        }
      }}
    />
  );
}
