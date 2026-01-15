"use client";

import updateAppointmentStatus from "@/actions/admin-appointment";
import { AppointmentStatus } from "@/generated/prisma/client";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ActionButtosProps {
  appointmentId: string;
  status: AppointmentStatus;
}

export const ActionButtons = ({ appointmentId, status }: ActionButtosProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: AppointmentStatus) => {
    setLoading(true);

    const res = await updateAppointmentStatus(appointmentId, newStatus);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  if (status === "COMPLETED" || status === "CANCELLED") {
    return <p className="text-sm text-center">-</p>;
  }

  return (
    <div className="flex justify-center gap-2">
      {status === "PENDING" && (
        <Button size="sm" onClick={() => handleUpdate("SCHEDULED")} disabled={loading}>
          {loading ? "..." : "Terima"}
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={loading}>
            Tolak
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Jadwal?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini akan mengubah status menjadi CANCELLED dan tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUpdate("CANCELLED")}>Ya, Batalkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
