import prisma from "@/lib/prisma";

interface CreateAppointmentParams {
  userId: string;
  doctorId: string;
  schedule: Date;
  reason: string;
  attachmentUrl?: string | null;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export async function createAppointmentService({ userId, doctorId, schedule, reason, attachmentUrl, user }: CreateAppointmentParams) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.appointment.findFirst({
      where: {
        doctorId,
        schedule,
        status: { not: "CANCELLED" },
      },
    });

    if (existing) {
      throw new Error("Slot waktu ini baru saja diambil orang lain.");
    }

    let patient = await tx.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      patient = await tx.patient.create({
        data: {
          userId,
          name: user.name || "Pasien Baru",
          phone: "000000000",
          gender: "MALE",
          birthDate: new Date(),
          address: "-",
          email: user.email!,
        },
      });
    }

    return tx.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        schedule,
        reason,
        status: "PENDING",
        attachmentUrl: attachmentUrl ?? null,
      },
    });
  });
}
