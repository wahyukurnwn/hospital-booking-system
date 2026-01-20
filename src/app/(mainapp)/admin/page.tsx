"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { ActionButtons } from "./_components/action-buttons";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

export default async function AdminPage() {
  // 1. Proteksi Halaman (Server Side)
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const [appointments, totalStats] = await Promise.all([
    // Query A: Ambil List Data
    prisma.appointment.findMany({
      include: { patient: true, doctor: true },
      orderBy: { createdAt: "desc" },
    }),

    // Query B: Hitung Statistik (Group By Status)
    prisma.appointment.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
  ]);

  const getCount = (status: string) => totalStats.find((s) => s.status === status)?._count.status || 0;

  const stats = {
    total: appointments.length,
    pending: getCount("PENDING"),
    scheduled: getCount("SCHEDULED"),
    cancelled: getCount("CANCELLED"),
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto mt-10 p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard (Konfirmasi Jadwal)</h1>

        <div className="grid grid-cols-1 max-w-35 sm:grid-cols-2 gap-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terkonfirmasi</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.scheduled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dibatalkan</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg shadow-sm border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pasien</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>
                    <div className="font-medium">{apt.patient.name}</div>
                    <div className="text-xs text-gray-500">{apt.patient.phone}</div>
                  </TableCell>
                  <TableCell>{apt.doctor.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{format(apt.schedule, "dd MMM yyyy", { locale: id })}</div>
                    <div className="font-bold text-xs text-blue-600">{format(apt.schedule, "HH:mm")}</div>
                  </TableCell>
                  <TableCell className="max-w-50 truncate text-gray-600 text-sm">{apt.reason}</TableCell>
                  <TableCell>
                    <StatusBadge status={apt.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionButtons appointmentId={apt.id} status={apt.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
