"use server";

import { auth } from "@/auth";
import { AppointmentStatus } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function updateAppointmentStatus(appointmenId: string, newStatus: AppointmentStatus, cancellationResaon?: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Akses ditolak. Anda bukan Admin!" };
  }

  try {
    await prisma.appointment.update({
      where: {
        id: appointmenId,
      },
      data: {
        status: newStatus,
        cancellationReason: cancellationResaon || null,
      },
    });

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
