"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { TimeSlot } from "@/features/appointment/hooks/use-booking-slots";

interface Props {
  field: any;
  fieldState: any;
  label?: string;
  options?: TimeSlot[];
  disabled?: boolean;
}

export const SlotPickerInput = ({ field, fieldState, label, options = [], disabled }: Props) => {
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {options.length > 0 ? (
          options.map((slot) => (
            <Button
              key={slot.time}
              type="button"
              // Disabled jika global disabled aktif ATAU slot tidak available
              disabled={disabled || !slot.available}
              // Jika dipilih user (field.value === slot.time), beri warna biru
              variant={field.value === slot.time ? "default" : "outline"}
              className={cn(
                "w-full transition-all relative",
                // Styling tambahan untuk slot yang disabled (biar user tau kenapa)
                !slot.available && "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100",
                field.value === slot.time && "bg-blue-600 hover:bg-blue-700 text-white"
              )}
              onClick={() => {
                // Prevent klik manual just in case (walau button sudah disabled)
                if (slot.available) {
                  field.onChange(slot.time);
                }
              }}
            >
              {slot.time}
              {/* Optional: Tampilkan badge kecil kenapa disabled */}
              {!slot.available && slot.reason === "booked" && <span className="sr-only">(Penuh)</span>}
            </Button>
          ))
        ) : (
          <div className="col-span-full p-3 text-sm text-muted-foreground bg-gray-50 rounded-md border border-dashed text-center">{disabled ? "Silakan pilih tanggal terlebih dahulu." : "Tidak ada jadwal tersedia / Dokter libur."}</div>
        )}
      </div>

      {fieldState.error && <FieldError errors={[fieldState.error.message]} />}
    </Field>
  );
};
