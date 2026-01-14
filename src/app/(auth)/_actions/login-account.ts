"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/features/auth/schemas/login.schema";

export default async function loginAccountAction(data: unknown) {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return {
      status: false,
      message: "Invalid form data",
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.password) {
    return {
      status: false,
      message: "User not found!",
    };
  }

  const validatePassword = await bcrypt.compare(password, existingUser.password);

  if (!validatePassword) {
    return {
      status: false,
      message: "Invalid password!",
    };
  }

  return {
    status: true,
    user: existingUser,
  };
}
