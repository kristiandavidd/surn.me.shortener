import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ensureTable } from "@/lib/db";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { ToastHandler } from "@/components/ToastHandler";

// Run table check
ensureTable().catch(console.error);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "surn.me • Link Shortener",
  description: "Shortener link sederhana dan cepat dengan domain surn.me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {children}
        <Toaster
          position="bottom-center"
          expand={true}
          richColors
          theme="light"
        />
        <Suspense fallback={null}>
          <ToastHandler />
        </Suspense>
      </body>
    </html>
  );
}
