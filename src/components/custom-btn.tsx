"use client";

import { ComponentProps, ReactNode } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface Props {
  loading?: boolean;
  children: ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  type?: ComponentProps<typeof Button>["type"];
  className?: ComponentProps<typeof Button>["className"];
}

export const CustomButton = ({ children, loading, type, variant, className }: Props) => {
  return (
    <Button className={className} type={type} variant={variant} disabled={loading}>
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
