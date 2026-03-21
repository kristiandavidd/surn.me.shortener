"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { IconLogout } from "@tabler/icons-react";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => logout()}
      className="text-primary border-primary rounded-full  py-2 hover:bg-primary/5"
    >
      <IconLogout className="w-4 h-4" />
    </Button>
  );
}
