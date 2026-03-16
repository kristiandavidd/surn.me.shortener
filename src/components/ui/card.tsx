import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-[#ACA786]/60 p-6  backdrop-blur-sm",
      className
    )}
    {...props}
  />
));

Card.displayName = "Card";

