"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { RegisteredSchema } from "../schemas/register.schema";
import registerAccountAction from "@/app/(auth)/_actions/register-account";

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisteredSchema) => {
    try {
      setIsLoading(true);

      const userData = await registerAccountAction(data);

      if (!userData?.status) {
        toast.error(userData?.message ?? "Something went wrong...");
        return;
      }
      toast.success(userData?.message);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading,
  };
}
