import z from "zod";

// Accept either a Date or an ISO date string from the client; coerce to Date
export const bookingSchema = z.object({
  doctorId: z.string(),

  date: z.date("Tanggal wajib dipilih"),
  time: z.string("Jam wajib dipilih"),
  reason: z.string().min(5, "Keluhan harus diisi minimal 5 karakter"),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
