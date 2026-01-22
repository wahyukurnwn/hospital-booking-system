"use server";

import { auth } from "@/auth";
import { bookingSchema, BookingSchema } from "../schemas/booking.schema";

import { revalidatePath } from "next/cache";
import { resend } from "@/lib/email";
import { AppointmentEmail } from "@/components/emails/appointment-email";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import prisma from "@/lib/prisma";
import { createAppointmentService } from "../services/create-appointment";

export async function createAppointmentAction(data: BookingSchema) {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: false, message: "Anda harus login untuk booking." };
  }

  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      status: false,
      message: "Form tidak valid",
      errors: parsed.error.issues.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    };
  }

  const { doctorId, date, time, attachmentUrl, reason } = parsed.data;

  const [hours, minutes] = time.split(":").map(Number);
  const schedule = new Date(date);
  schedule.setHours(hours, minutes, 0, 0);

  try {
    await createAppointmentService({
      userId: session.user.id,
      doctorId,
      schedule,
      reason,
      attachmentUrl,
      user: session.user,
    });

    if (session.user.email) {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        select: { name: true },
      });

      await resend.emails.send({
        from: "Klinik Sehat <onboarding@resend.dev>",
        to: session.user.email,
        subject: "Permintaan Booking Diterima",
        react: AppointmentEmail({
          patientName: session.user.name || "Pasien",
          doctorName: doctor?.name || "Dokter",
          date: format(date, "EEEE, d MMMM yyyy", { locale: id }),
          time,
          type: "CREATED",
        }),
      });
    }

    revalidatePath("/dashboard");
    return { status: true };
  } catch (error: any) {
    return {
      status: false,
      message: error.message || "Gagal membuat booking",
    };
  }
}
