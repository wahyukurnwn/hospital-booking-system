import { AppointmentStatus } from "@/generated/prisma/client";
import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    SCHEDULED: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    COMPLETED: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
    CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    NO_SHOW: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
  };

  const labels = {
    PENDING: "Menunggu Konfirmasi",
    SCHEDULED: "Terjadwal",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
    NO_SHOW: "Tidak Hadir",
  };

  return <Badge className={styles[status]}>{labels[status]}</Badge>;
};
