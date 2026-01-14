"use client";

import { toast } from "sonner";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import createAppointmentAction from "@/actions/create-appointment";

import { Doctor, DoctorSchedule } from "@/generated/prisma/client";
import { useBookingSlots } from "@/features/appointment/hooks/use-booking-slots";
import { CustomButton } from "../custom-btn";
import { FieldGroup, FieldSet } from "../ui/field";
import { bookingSchema, BookingSchema } from "@/features/appointment/schemas/booking.schema";
import { CustomController } from "./custom-controller";
import { FieldType } from "@/constants/types";

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
      reason: "",
      date: undefined,
      time: "",
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

        if (res.errors) {
          res.errors.forEach((err: any) => {
            form.setError(err.path[0], { message: err.message });
          });
        }
      } else {
        toast.success("Booking Berhasil! Menunggu konfirmasi admin.");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <FieldSet>
        <FieldGroup>
          <CustomController control={form.control} fieldType={FieldType.DATE} name="date" label="Pilih Tanggal Konsultasi" />

          <CustomController control={form.control} fieldType={FieldType.SLOT} name="time" label={selectedDate ? "Pilih Jam Tersedia" : "Jadwal Dokter"} options={availableSlots} disabled={!selectedDate} />

          <CustomController control={form.control} fieldType={FieldType.TEXTAREA} name="reason" label="Keluhan" placeholder="Demam naik turun sejak 3 hari lalu..." />

          <CustomButton type="submit" className="w-full" loading={loading}>
            Konfirmasi Booking
          </CustomButton>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
