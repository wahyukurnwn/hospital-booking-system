"use server";

import prisma from "@/lib/prisma";

import { BookingForm } from "@/components/forms/booking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      schedules: true,
    },
  });

  if (!doctor) return <div>Dokter tidak ditemukan</div>;

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);

  const existingBookings = await prisma.appointment.findMany({
    where: {
      doctorId: id,
      schedule: {
        gte: today,
        lte: nextMonth,
      },
      status: { not: "CANCELLED" },
    },
    select: { schedule: true },
  });

  const bookedSlots = existingBookings.map((b) => b.schedule.toISOString());

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto mt-10 max-w-4xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Booking Jadwal: {doctor.name}</CardTitle>
            <p className="text-gray-500">Spesialis {doctor.specialization}</p>
          </CardHeader>
          <CardContent>
            <BookingForm doctor={doctor} bookedSlots={bookedSlots} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
