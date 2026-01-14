"use server";

import { auth } from "@/auth";
import { BookingSchema, bookingSchema } from "@/features/appointment/schemas/booking.schema";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function createAppointmentAction(data: BookingSchema) {
  const session = await auth();

  if (!session?.user.id) {
    return {
      status: false,
      message: "Anda harus login untuk melakukan booking!",
    };
  }

  const validated = bookingSchema.safeParse(data);

  if (!validated.success) {
    const first = validated.error.issues[0];
    const message = first?.message || "Invalid form data";

    return {
      status: false,
      message,
      errors: validated.error.issues.map((e: any) => ({ path: e.path, message: e.message })),
    };
  }

  const { doctorId, date, time, reason } = validated.data;

  const [hours, minutes] = time.split(":").map(Number);

  const bookingTime = new Date(date);

  bookingTime.setHours(hours, minutes, 0, 0);

  try {
    await prisma.$transaction(async (tx) => {
      const existingAppointment = await tx.appointment.findFirst({
        where: {
          doctorId,
          schedule: bookingTime,
          status: {
            not: "CANCELLED",
          },
        },
      });

      if (existingAppointment) {
        throw new Error("Mohon maaf, slot waktu ini baru saja diambil orang lain.");
      }

      let patient = await tx.patient.findUnique({
        where: {
          userId: session.user.id,
        },
      });

      if (!patient) {
        patient = await tx.patient.create({
          data: {
            userId: session.user.id,
            name: session.user.name || "Pasient Baru",
            phone: "000000000",
            gender: "MALE",
            birthDate: new Date(),
            address: "-",
            email: session.user.email,
          },
        });
      }

      await tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId,
          schedule: bookingTime,
          reason,
          status: "PENDING",
        },
      });
    });

    revalidatePath("/");
    return { status: true, message: "Booking Berhasil!" };
  } catch (error: any) {
    return {
      status: false,
      message: error.message || "Gagal membuat jadwal",
    };
  }
}
