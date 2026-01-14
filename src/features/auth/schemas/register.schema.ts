import * as z from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(3, "Name must be at least 3 characters").max(120, "Name must be at most 120 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisteredSchema = z.infer<typeof registerSchema>;
