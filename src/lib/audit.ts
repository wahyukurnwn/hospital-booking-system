"use server";

import { auth } from "@/auth";
import prisma from "./prisma";

export default async function createAuditLog(action: string, entityType: string, entityId: string, details?: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) return;

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action,
        entityType,
        entityId,
        details,
      },
    });
  } catch (error) {
    console.error("Gagal membuat audit log:", error);
  }
}
