"use server";

import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatRupiah } from "@/actions/currency-format";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    include: {
      schedules: true,
    },
  });

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto mt-10 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Pilih Dokter Spesialis</h1>
          <p className="mt-">Temukan dokter terbaik kami dan buat janji temu sesuai jadwal Anda.</p>
        </div>

        {/* Grid Card Dokter */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row gap-4 items-center">
                {/* Avatar Placeholder (bisa diganti Image nanti) */}
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">{doctor.name.charAt(0)}</div>
                <div>
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription className="font-medium text-blue-600">Spesialis {doctor.specialization}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 line-clamp-2">{doctor.bio || "Tidak ada deskripsi."}</p>

                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>Biaya Konsultasi:</span>
                    <span className="text-green-600">{formatRupiah(doctor.price ?? 0)}</span>
                  </div>

                  {/* Tampilkan Hari Praktek */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {doctor.schedules.length > 0 ? (
                      doctor.schedules.map((sch) => (
                        <Badge key={sch.id} variant="secondary" className="text-xs">
                          {sch.dayOfWeek} ({sch.startTime}-{sch.endTime})
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-red-500 italic">Jadwal belum tersedia</span>
                    )}
                  </div>

                  <Link href={`/book/${doctor.id}`} className="block mt-4">
                    <Button className="w-full">Booking Jadwal</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {doctors.length === 0 && <div className="text-center mt-20 text-gray-500">Belum ada data dokter. Pastikan seeding database berhasil.</div>}
      </div>
    </main>
  );
}
