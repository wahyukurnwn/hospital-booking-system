"use server";

import { auth } from "@/auth";
import { AppointmentStatus } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { AppointmentEmail } from "@/components/emails/appointment-email";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { resend } from "@/lib/email";
import createAuditLog from "@/lib/audit";

export default async function updateAppointmentStatus(appointmentId: string, newStatus: AppointmentStatus, cancellationReason?: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Akses ditolak. Anda bukan Admin!" };
  }

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: newStatus,
        cancellationReason: cancellationReason || null,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    await createAuditLog("UPDATE_STATUS", "Appointment", appointmentId, `Mengubah status menjadi ${newStatus}. Alasan: ${cancellationReason || "-"}`);

    const formattedDate = format(updatedAppointment.schedule, "EEEE, d MMMM yyyy", { locale: id });
    const formattedTime = format(updatedAppointment.schedule, "HH:mm");

    if (newStatus === "SCHEDULED" && updatedAppointment.patient.email) {
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

    if (newStatus === "CANCELLED" && updatedAppointment.patient.email) {
      await resend.emails.send({
        from: "Klinik Sehat <onboarding@resend.dev>",
        to: updatedAppointment.patient.email,
        subject: "Pemberitahuan Pembatalan Jadwal ❌",
        react: AppointmentEmail({
          patientName: updatedAppointment.patient.name,
          doctorName: updatedAppointment.doctor.name,
          date: formattedDate,
          time: formattedTime,
          type: "CANCELLED",
          reason: cancellationReason || "Alasan operasional klinik.",
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
