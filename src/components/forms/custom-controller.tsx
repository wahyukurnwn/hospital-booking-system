"use client";

import { FieldType } from "@/constants/types";

import { TextInput } from "./inputs/text-input";
import { SelectInput } from "./inputs/select-input";
import { TextareaInput } from "./inputs/textarea-input";
import { RadioInput } from "./inputs/radio-group-input";
import { DatePickerInput } from "./inputs/datepicker-input";
import { Control, Controller } from "react-hook-form";
import { SlotPickerInput } from "./inputs/slot-picker-input";
import { TimeSlot } from "@/features/appointment/hooks/use-booking-slots";

interface Option {
  label: string;
  value: string;
}

interface CustomControllerProps {
  control: Control<any>;
  name: string;
  label?: string;
  fieldType: FieldType;
  placeholder?: string;
  disabled?: boolean;
  options?: any[];
}

export const CustomController = (props: CustomControllerProps) => {
  const { control, name, fieldType, ...otherProps } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const inputProps = {
          field,
          fieldState,
          ...otherProps,
        };

        switch (fieldType) {
          case FieldType.TEXT:
          case FieldType.EMAIL:
          case FieldType.PASSWORD:
          case FieldType.PHONE:
            return <TextInput {...inputProps} type={fieldType} />;

          case FieldType.TEXTAREA:
            return <TextareaInput {...inputProps} />;

          case FieldType.SELECT:
            return <SelectInput {...inputProps} />;

          case FieldType.RADIO:
            return <RadioInput {...inputProps} />;

          case FieldType.DATE:
            return <DatePickerInput {...inputProps} />;

          case FieldType.SLOT:
            return <SlotPickerInput {...inputProps} options={otherProps.options as TimeSlot[]} />;

          default:
            return <></>;
        }
      }}
    />
  );
};
