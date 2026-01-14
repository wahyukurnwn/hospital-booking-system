"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { CustomButton } from "../custom-btn";
import { FieldType } from "@/constants/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/features/auth/hooks/use-register";

import { CustomController } from "./custom-controller";
import { SignInWithGoogleForm } from "./sign-in-with-google-form";
import { FieldDescription, FieldGroup, FieldSeparator, FieldSet } from "@/components/ui/field";
import { RegisteredSchema, registerSchema } from "@/features/auth/schemas/register.schema";

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const { onSubmit, isLoading } = useRegister();

  const form = useForm<RegisteredSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldSet>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center mb-4">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground text-sm">Fill in the form below</p>
            </div>
            <CustomController control={form.control} fieldType={FieldType.TEXT} name="name" label="Full Name" placeholder="John Doe" />
            <CustomController control={form.control} fieldType={FieldType.EMAIL} name="email" label="Email" placeholder="me@example.com" />
            <CustomController control={form.control} fieldType={FieldType.PASSWORD} name="password" label="Password" placeholder="Password" />
            <CustomButton type="submit" className="w-full" loading={isLoading}>
              Create Account
            </CustomButton>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or continue with</FieldSeparator>
          </FieldGroup>
        </FieldSet>
      </form>

      <SignInWithGoogleForm className="my-6" />

      <FieldDescription className="px-6 text-center">
        Already have an account? <Link href="/login">Log in</Link>
      </FieldDescription>
    </>
  );
}
