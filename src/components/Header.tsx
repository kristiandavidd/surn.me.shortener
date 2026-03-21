"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./LogoutButton";
import { DesktopToggle } from "./DesktopToggle";
import { motion } from "framer-motion";

export function Header({ session }: { session: any }) {
  return (
    <>
      {/* Shared Header Content */}
      {session && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-4 md:top-6 left-0 right-0 z-40 px-4 md:px-6"
        >
          <header className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-3 py-2 bg-[#F7F5E6]/80 backdrop-blur-md border border-[#DCC9A6] rounded-full shadow-lg">
            <div className="flex items-center gap-3">
              {/* Desktop Logo */}
              <Link href="/" className="hidden md:flex items-center ml-2 mr-1">
                <Image
                  src="/logo.svg"
                  alt="surn.me"
                  width={60}
                  height={60}
                  className="w-16 h-auto"
                />
              </Link>

              {/* Account Info (Mobile only) */}
              <div className="flex md:hidden items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-primary truncate max-w-[120px]">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-brown truncate max-w-[150px]">
                    {session.user.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Toggle (Middle) */}
            <DesktopToggle />

            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {/* Account Info (Desktop only) */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col min-w-0 items-end text-right">
                  <span className="text-sm font-bold text-primary truncate">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-brown truncate max-w-[200px]">
                    {session.user.email}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <LogoutButton />
            </div>
          </header>
        </motion.div>
      )}

      {!session && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-6 left-0 right-0 z-50 px-6"
        >
          <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-[#F7F5E6]/80 backdrop-blur-md border border-[#DCC9A6] rounded-full shadow-lg">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="surn.me"
                width={70}
                height={70}
                priority
              />
            </Link>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-brown rounded-full px-5 hover:bg-brown/10"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-full px-6 shadow-md shadow-primary/20"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </header>
        </motion.div>
      )}
    </>
  );
}
