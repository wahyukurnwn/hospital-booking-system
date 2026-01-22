"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { uploadFileAction } from "@/lib/upload-action";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

interface Props {
  field: ControllerRenderProps<any, any>;
  fieldState: ControllerFieldState;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

function isValidImageUrl(value?: string | null) {
  if (!value) return false;
  if (value.startsWith("/")) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function FileUploadInput({ field, fieldState, label, placeholder, disabled }: Props) {
  const [uploading, setUploading] = useState(false);
  const rawValue = field.value as string | null | undefined;

  const imageUrl = useMemo(() => (isValidImageUrl(rawValue) ? rawValue : null), [rawValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diperbolehkan");
      return;
    }

    setUploading(true);

    try {
      const res = await uploadFileAction(file);
      if (!res?.status || !res?.url) throw new Error(res?.message);

      field.onChange(res.url);
      toast.success("File berhasil diupload");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan upload");
      field.onChange(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = () => {
    field.onChange(null);
  };

  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}

      <div className="w-full">
        {imageUrl ? (
          <div className="relative aspect-video w-full max-w-52 rounded-lg overflow-hidden border bg-gray-50 shadow-sm group">
            <Image src={imageUrl} alt="Uploaded file" fill className="object-cover" unoptimized />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete} disabled={disabled}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className={cn("flex items-center gap-2 px-3 py-2 border rounded-md bg-white transition-colors", fieldState.error ? "border-red-500" : "border-input", uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/50")}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <UploadCloud className="h-4 w-4 text-muted-foreground" />}

              <Input type="file" accept="image/*" onChange={handleFileChange} disabled={disabled || uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />

              <span className="text-sm text-muted-foreground truncate">{uploading ? "Sedang mengupload..." : placeholder || "Klik untuk upload gambar"}</span>
            </div>
          </div>
        )}
      </div>

      {!imageUrl && !fieldState.error && <p className="text-[0.8rem] text-muted-foreground">Maksimal ukuran 2MB (JPG/PNG).</p>}

      {fieldState.error && <FieldError errors={[{ message: fieldState.error.message }]} />}
    </Field>
  );
}
