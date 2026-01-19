"use server";

import { auth } from "@/auth";
import { AppointmentStatus } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { AppointmentEmail } from "@/components/emails/appointment-email";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { resend } from "@/lib/email";

export default async function updateAppointmentStatus(appointmenId: string, newStatus: AppointmentStatus, cancellationResaon?: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Akses ditolak. Anda bukan Admin!" };
  }

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmenId,
      },
      data: {
        status: newStatus,
        cancellationReason: cancellationResaon || null,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (newStatus === "SCHEDULED" && updatedAppointment.patient.email) {
      const formattedDate = format(updatedAppointment.schedule, "EEEE, d MMMM yyyy", { locale: id });
      const formattedTime = format(updatedAppointment.schedule, "HH:mm");

      await resend.emails.send({
        from: "Klinik Sehat <onboarding@resend.dev>",
        to: updatedAppointment.patient.email, // Kirim ke email pasien
        subject: "Jadwal Dokter Terkonfirmasi ✅",
        react: AppointmentEmail({
          patientName: updatedAppointment.patient.name,
          doctorName: updatedAppointment.doctor.name,
          date: formattedDate,
          time: formattedTime,
          type: "CONFIRMATION",
        }),
      });
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return { success: true, message: "Status berhasil diperbarui" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengupdate database",
    };
  }
}
