"use server";

import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <section>
      <SignOut />
      {children}
    </section>
  );
}
