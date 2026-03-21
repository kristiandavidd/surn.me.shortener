"use client";

import { cn } from "@/lib/utils";
import { useMode } from "./ModeProvider";
import { motion } from "framer-motion";

export function DesktopToggle() {
  const { mode, setMode } = useMode();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center bg-[#DCC9A6]/30 p-1 rounded-full border border-[#DCC9A6] shadow-inner backdrop-blur-sm pointer-events-auto"
    >
      <button
        onClick={() => setMode("tree")}
        className={cn(
          "relative px-6 py-1.5 text-sm font-semibold rounded-full transition-all duration-300",
          mode === "tree" ? "text-[#F7F5E6]" : "text-brown hover:text-brown/80"
        )}
      >
        {mode === "tree" && (
          <motion.div 
            layoutId="desktop-nav-pill"
            className="absolute inset-0 bg-primary rounded-full shadow-md -z-10"
          />
        )}
        Tree
      </button>
      <button
        onClick={() => setMode("shortener")}
        className={cn(
          "relative px-6 py-1.5 text-sm font-semibold rounded-full transition-all duration-300",
          mode === "shortener" ? "text-[#F7F5E6]" : "text-brown hover:text-brown/80"
        )}
      >
        {mode === "shortener" && (
          <motion.div 
            layoutId="desktop-nav-pill"
            className="absolute inset-0 bg-primary rounded-full shadow-md -z-10"
          />
        )}
        Shortener
      </button>
    </motion.div>
  );
}
