"use client";

import { useState } from "react";
import { DayOfWeek, DoctorSchedule } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";
import { saveDoctorSchedule, ScheduleInput } from "@/actions/doctor-schedule";

const DAYS: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

interface Props {
  existingSchedules: DoctorSchedule[];
}

export function ScheduleForm({ existingSchedules }: Props) {
  const [loading, setLoading] = useState(false);

  // Inisialisasi state awal dengan data database atau default value
  const [schedules, setSchedules] = useState<ScheduleInput[]>(() => {
    return DAYS.map((day) => {
      const existing = existingSchedules.find((s) => s.dayOfWeek === day);
      return {
        dayOfWeek: day,
        // Default jam kerja: 09:00 - 17:00
        startTime: existing?.startTime || "09:00",
        endTime: existing?.endTime || "17:00",
        isAvailable: existing?.isAvailable ?? false, // Default libur
      };
    });
  });

  // Handler perubahan input
  const handleChange = (index: number, field: keyof ScheduleInput, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  // Submit Handler
  const onSubmit = async () => {
    setLoading(true);
    const res = await saveDoctorSchedule(schedules);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm">
        {schedules.map((item, index) => (
          <div key={item.dayOfWeek} className={`flex items-center gap-4 p-4 border-b last:border-0 ${!item.isAvailable ? "bg-gray-50 opacity-75" : ""}`}>
            {/* 1. Nama Hari & Toggle */}
            <div className="w-40 flex items-center gap-3">
              <Switch checked={item.isAvailable} onCheckedChange={(checked) => handleChange(index, "isAvailable", checked)} />
              <span className="font-medium text-sm w-24">{item.dayOfWeek}</span>
            </div>

            {/* 2. Input Jam (Hanya aktif jika Available) */}
            <div className="flex items-center gap-2 flex-1">
              <Input type="time" value={item.startTime} onChange={(e) => handleChange(index, "startTime", e.target.value)} disabled={!item.isAvailable} className="w-32" />
              <span className="text-gray-400">-</span>
              <Input type="time" value={item.endTime} onChange={(e) => handleChange(index, "endTime", e.target.value)} disabled={!item.isAvailable} className="w-32" />
            </div>

            <div className="text-sm text-gray-400 w-24 text-right">{item.isAvailable ? "Aktif" : "Libur"}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={loading} size="lg">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Perubahan Jadwal
        </Button>
      </div>
    </div>
  );
}
