import z from "zod";

export const bookingSchema = z.object({
  doctorId: z.string(),

  date: z.date("Tanggal wajib dipilih"),
  time: z.string("Jam wajib dipilih"),
  reason: z.string().min(5, "Keluhan harus diisi minimal 5 karakter"),

  attachmentUrl: z.string().optional().nullable(),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
