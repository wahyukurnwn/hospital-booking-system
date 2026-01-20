import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ScheduleForm } from "./_components/schedule-form";
import prisma from "@/lib/prisma";

export default async function DoctorSchedulePage() {
  const session = await auth();

  // 1. Proteksi: Hanya DOCTOR yang boleh masuk
  if (!session?.user || session.user.role !== "DOCTOR") {
    return redirect("/");
  }

  // 2. Ambil Profil Dokter
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: { schedules: true }, // Ambil jadwal yang sudah ada
  });

  if (!doctor) {
    return <div className="p-10 text-center">Profil Dokter tidak ditemukan. Hubungi Admin.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto mt-10 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Jadwal Praktek</h1>
          <p className="text-gray-500 mt-2">Halo Dr. {doctor.name}, silakan atur jam ketersediaan Anda di bawah ini. Pasien hanya bisa mem-booking di jam yang berstatus "Aktif".</p>
        </div>

        {/* Render Client Component Form */}
        <ScheduleForm existingSchedules={doctor.schedules} />
      </div>
    </main>
  );
}
