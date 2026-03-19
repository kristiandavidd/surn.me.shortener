"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => logout()}
      className="text-primary border-primary hover:bg-primary/5"
    >
      Logout
    </Button>
  );
}
