"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldType } from "@/constants/types";

import { useForm } from "react-hook-form";
import { FieldDescription, FieldGroup, FieldSeparator, FieldSet } from "@/components/ui/field";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { CustomController } from "./custom-controller";
import { SignInWithGoogleForm } from "./sign-in-with-google-form";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema, LoginSchema } from "@/features/auth/schemas/login.schema";
import { CustomButton } from "../custom-btn";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { onSubmit, isLoading } = useLogin();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInWithGoogleForm className="mb-7" />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or continue with</FieldSeparator>

                <CustomController control={form.control} fieldType={FieldType.EMAIL} name="email" label="Email" placeholder="me@example.com" />

                <CustomController control={form.control} fieldType={FieldType.PASSWORD} name="password" label="Password" placeholder="Password" />

                <CustomButton type="submit" className="w-full" loading={isLoading}>
                  Login
                </CustomButton>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
