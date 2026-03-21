"use client";

import { cn } from "@/lib/utils";
import { useMode } from "./ModeProvider";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navbar() {
  const { mode, setMode } = useMode();

  return (
    <>
      {/* Mobile Navbar (Bottom Center) */}
      <motion.div 
        initial={{ y: 100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="md:hidden fixed bottom-8 left-1/2 z-50 w-full px-6"
      >
        <div className="bg-primary/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/20 flex items-center justify-between gap-1 max-w-sm mx-auto">
          {/* Logo Section */}
          <div className="flex items-center ml-3 shrink-0">
            <Image 
              src="/logo.svg" 
              alt="logo" 
              width={80} 
              height={32} 
              className="w-20 brightness-0 invert opacity-90" 
            />
          </div>

          <div className="flex items-center gap-1 flex-1 justify-end mr-1">
            <button
              onClick={() => setMode("tree")}
              className={cn(
                "relative px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300",
                mode === "tree" 
                  ? "text-primary" 
                  : "text-white/60 hover:text-white"
              )}
            >
              {mode === "tree" && (
                <motion.div 
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-lg -z-10"
                />
              )}
              Tree
            </button>

            <button
              onClick={() => setMode("shortener")}
              className={cn(
                "relative px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300",
                mode === "shortener" 
                  ? "text-primary" 
                  : "text-white/60 hover:text-white"
              )}
            >
              {mode === "shortener" && (
                <motion.div 
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-lg -z-10"
                />
              )}
              Short
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
