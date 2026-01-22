"use server";

import { auth } from "@/auth";
import { uploadToStorage } from "@/lib/upload/upload.service";

export async function uploadFileAction(file: File) {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: false, message: "Unauthorized" };
  }

  try {
    const result = await uploadToStorage({
      file,
      folder: "attachments",
    });

    return {
      status: true,
      url: result.url,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      status: false,
      message: "Gagal upload file",
    };
  }
}
