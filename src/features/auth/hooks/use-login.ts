"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { LoginSchema } from "../schemas/login.schema";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginSchema) => {
    try {
      setIsLoading(true);

      // Use NextAuth client helper to sign in with credentials provider
      const res: any = await signIn("credentials", { ...data, redirect: false });

      if (res?.error) {
        toast.error(res.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading,
  };
}
