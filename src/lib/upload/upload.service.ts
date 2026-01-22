"use server";

import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

interface UploadParams {
  file: File;
  folder: string;
}

export async function uploadToStorage({ file, folder }: UploadParams) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop();
  const key = `${folder}/${uuidv4()}.${ext}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_CLOUDFLARE_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    const fileUpload = await s3Client.send(command);
    console.log(fileUpload);

    return {
      key,
      url: `${process.env.R2_PUBLIC_BASE_URL}/${key}`,
    };
  } catch (error) {
    console.error("R2 Error:", error);
    return {
      status: false,
      message: "Gagal membuat upload URL",
    };
  }
}
