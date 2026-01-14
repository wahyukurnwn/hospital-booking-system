"use server";

import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/features/auth/schemas/register.schema";

export default async function registerAccountAction(data: unknown) {
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      status: false,
      message: "Invalid form data",
    };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      status: false,
      message: "Email already registered!",
    };
  }

  const hashedPassword = await hash(password, 12);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return {
    status: true,
    message: "Registered successfully!",
    data: newUser,
  };
}
