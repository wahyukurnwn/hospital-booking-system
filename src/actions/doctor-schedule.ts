"use server";

import { auth } from "@/auth";

import { DayOfWeek } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Tipe data input dari form
export type ScheduleInput = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export async function saveDoctorSchedule(schedules: ScheduleInput[]) {
  const session = await auth();

  if (!session?.user || session.user.role !== "DOCTOR") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // 1. Cari ID Dokter berdasarkan User yang login
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return { success: false, message: "Profil dokter tidak ditemukan." };
    }

    // 2. Loop dan simpan jadwal satu per satu
    // Kita gunakan Promise.all agar parallel dan cepat
    await Promise.all(
      schedules.map((schedule) =>
        prisma.doctorSchedule.upsert({
          where: {
            doctorId_dayOfWeek: {
              doctorId: doctor.id,
              dayOfWeek: schedule.dayOfWeek,
            },
          },
          update: {
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isAvailable: schedule.isAvailable,
          },
          create: {
            doctorId: doctor.id,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isAvailable: schedule.isAvailable,
          },
        }),
      ),
    );

    // 3. Catat Audit Log (Fitur yang baru kita buat tadi!)
    // (Import dulu createAuditLog di atas jika mau dipakai)

    revalidatePath("/doctor/schedule");
    return { success: true, message: "Jadwal berhasil diperbarui!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menyimpan jadwal." };
  }
}
