"use server";

import Link from "next/link";
import { auth } from "@/auth";
import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { id } from "date-fns/locale";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User as UserIcon } from "lucide-react";

export default async function DashboardPage() {
  // check logib
  const session = await auth();
  if (!session?.user) redirect("/login");

  // find patient
  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
  });

  if (!patient) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto mt-10 px-4 text-center">
          <h2 className="text-xl font-semibold">Belum ada riwayat booking.</h2>
          <Link href="/doctors">
            <Button className="mt-4">Cari Dokter Sekarang</Button>
          </Link>
        </div>
      </main>
    );
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: true,
    },
    orderBy: {
      schedule: "desc",
    },
  });

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto mt-10 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Pasien</h1>
            <p className="text-gray-300">Halo, {session.user.name}. Berikut riwayat konsultasi Anda.</p>
          </div>
          <Link href="/doctors">
            <Button>+ Booking Baru</Button>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Anda belum memiliki jadwal konsultasi.</p>
              <Link href="/doctors">
                <Button variant="outline">Lihat Jadwal Dokter</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {/* Dummy Avatar*/}
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{apt.doctor.name.charAt(0)}</div>
                      <div>
                        <CardTitle className="text-lg">{apt.doctor.name}</CardTitle>
                        <CardDescription>Spesialis {apt.doctor.specialization}</CardDescription>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {format(apt.schedule, "EEEE, d MMMM yyyy", { locale: id })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(apt.schedule, "HH:mm")} WIB
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs font-medium text-gray-500 uppercase">Keluhan</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{apt.reason}</p>
                    </div>
                  </div>

                  {/* Jika status CANCELLED dan ada alasan pembatalan */}
                  {apt.status === "CANCELLED" && apt.cancellationReason && (
                    <div className="mt-4 bg-red-50 p-3 rounded-md border border-red-100 text-sm text-red-700">
                      <strong>Alasan Pembatalan:</strong> {apt.cancellationReason}
                    </div>
                  )}

                  {/* Jika status SCHEDULED, tampilkan nomor antrean (jika ada) */}
                  {apt.status === "SCHEDULED" && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-500">Estimasi Waktu Tunggu</p>
                        <p className="text-xs text-blue-600 mt-1">Mohon datang 15 menit sebelum jadwal ({format(apt.schedule, "HH:mm")}). Rata-rata durasi konsultasi adalah 20 menit per pasien.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
