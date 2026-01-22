"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Doctor, DoctorSchedule } from "@/generated/prisma/client";
import { CustomButton } from "@/components/custom-btn";
import { FieldGroup, FieldSet } from "@/components/ui/field";

import { FieldType } from "@/constants/types";
import { bookingSchema, BookingSchema } from "@/features/appointment/schemas/booking.schema";
import { useBookingSlots } from "@/features/appointment/hooks/use-booking-slots";
import { createAppointmentAction } from "@/features/appointment/actions/create-appointment.action";
import { CustomController } from "./custom-controller";

interface BookingFormProps {
  doctor: Doctor & { schedules: DoctorSchedule[] };
  bookedSlots: string[];
}

export function BookingForm({ doctor, bookedSlots }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      doctorId: doctor.id,
      date: undefined,
      time: "",
      reason: "",
      attachmentUrl: null,
    },
  });

  const selectedDate = form.watch("date");

  const availableSlots = useBookingSlots({
    doctor,
    bookedSlots,
    selectedDate,
  });

  const onSubmit = async (values: BookingSchema) => {
    setLoading(true);
    try {
      const res = await createAppointmentAction(values);

      if (!res.status) {
        toast.error(res.message);
        res.errors?.forEach((err) => {
          form.setError(err.path[0] as keyof BookingSchema, {
            message: err.message,
          });
        });
        return;
      }

      toast.success("Booking berhasil! Menunggu konfirmasi admin.");
      router.push("/dashboard");
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <FieldSet>
        <FieldGroup>
          <CustomController control={form.control} name="date" fieldType={FieldType.DATE} label="Pilih Tanggal Konsultasi" />

          <CustomController control={form.control} name="time" fieldType={FieldType.SLOT} label={selectedDate ? "Pilih Jam Tersedia" : "Jadwal Dokter"} options={availableSlots} disabled={!selectedDate} />

          <CustomController control={form.control} name="reason" fieldType={FieldType.TEXTAREA} label="Keluhan" placeholder="Demam naik turun sejak 3 hari lalu..." />

          <CustomController control={form.control} name="attachmentUrl" fieldType={FieldType.FILE} label="Lampiran Dokumen (Opsional)" placeholder="Upload KTP atau Surat Rujukan" />

          <CustomButton type="submit" className="w-full" loading={loading}>
            Konfirmasi Booking
          </CustomButton>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
