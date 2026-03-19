import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function Header() {
  const session = await getSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="surn.me" width={80} height={80} priority />
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {session.user.name}
            </span>
            <LogoutButton />
          </div>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm" className="text-gray-600">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
