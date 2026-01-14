import { useMemo } from "react";
import { format, isBefore, addMinutes } from "date-fns";
import { Doctor, DoctorSchedule } from "@/generated/prisma/client";

interface UseBookingSlotsProps {
  doctor: Doctor & { schedules: DoctorSchedule[] };
  bookedSlots: string[];
  selectedDate: Date | undefined;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: "booked" | "past";
}

export function useBookingSlots({ doctor, bookedSlots, selectedDate }: UseBookingSlotsProps) {
  const slots = useMemo(() => {
    if (!selectedDate) return [];

    const dayIndex = selectedDate.getDay();
    const daysMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const dayName = daysMap[dayIndex];

    const schedule = doctor.schedules.find((s) => s.dayOfWeek === dayName);
    if (!schedule || !schedule.isAvailable) return [];

    const generatedSlots: TimeSlot[] = [];

    // Parse jam mulai & selesai
    const [startHour, startMinute] = schedule.startTime.split(":").map(Number);
    const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

    // Set waktu awal slot pada tanggal yang dipilih
    let current = new Date(selectedDate);
    current.setHours(startHour, startMinute, 0, 0);

    // Set batas akhir slot
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);

    const now = new Date(); // Waktu sekarang (Client side)

    // Loop generate slot
    while (current < end) {
      const timeString = format(current, "HH:mm");

      // 1. CEK APAKAH SUDAH DI-BOOKING?
      const isBooked = bookedSlots.some((slotIso) => {
        const slotDate = new Date(slotIso);
        return slotDate.getTime() === current.getTime();
      });

      // 2. CEK APAKAH WAKTU SUDAH LEWAT? (Past Time Logic)
      // Kita beri buffer 0 menit (Strict). Kalau mau buffer 30 menit sblmnya, ubah logic ini.
      // isBefore berasal dari date-fns untuk membandingkan tanggal+jam
      const isPast = isBefore(current, now);

      let status: TimeSlot = {
        time: timeString,
        available: true,
      };

      if (isPast) {
        status.available = false;
        status.reason = "past";
      } else if (isBooked) {
        status.available = false;
        status.reason = "booked";
      }

      generatedSlots.push(status);

      // Tambah 30 menit untuk loop berikutnya
      current = addMinutes(current, 30);
    }

    return generatedSlots;
  }, [selectedDate, doctor, bookedSlots]);

  return slots;
}
