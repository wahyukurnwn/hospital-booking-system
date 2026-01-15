"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { ActionButtons } from "./_components/action-buttons";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import prisma from "@/lib/prisma";

export default async function AdminPage() {
  // 1. Proteksi Halaman (Server Side)
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen">
      <div className="container mx-auto mt-10 p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard (Konfirmasi Jadwal)</h1>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pasien</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Jadwal Request</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Tidak ada data appointment.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">
                      {apt.patient.name}
                      <br />
                      <span className="text-xs text-gray-500">{apt.patient.phone}</span>
                    </TableCell>
                    <TableCell>{apt.doctor.name}</TableCell>
                    <TableCell>
                      {format(apt.schedule, "eeee, d MMM yyyy", { locale: id })}
                      <br />
                      <span className="font-bold">{format(apt.schedule, "HH:mm")}</span>
                    </TableCell>
                    <TableCell className="max-w-50 truncate text-gray-600">{apt.reason}</TableCell>
                    <TableCell>
                      <StatusBadge status={apt.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButtons appointmentId={apt.id} status={apt.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
