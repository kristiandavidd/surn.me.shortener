/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  const code = searchParams.get("code") ?? "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const shortUrl = useMemo(() => {
    if (!code || !origin) return "";
    return `${origin.replace(/\/+$/, "")}/${code}`;
  }, [code, origin]);

  if (!code) {
    router.replace("/");
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <Card className="w-full max-w-xl p-6">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-primary font-georgia">
            Your Link Has Been Generated!
          </h1>
          <p className="text-xs text-[#847353]">
            Now you can share this link with your friends!
          </p>
        </div>

        <div className="mb-6 space-y-2">
          <p className="md:text-xs text-[10px] font-bold uppercase tracking-wider text-primary">
            SHORT URL
          </p>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 rounded-md bg-[#F7F5E6] px-3 py-3 font-mono text-sm text-[#8F0810] whitespace-nowrap overflow-hidden text-ellipsis border border-[#DCC9A6]"
              title={shortUrl}
            >
              {shortUrl}
            </div>
            <Button
              type="button"
              onClick={handleCopy}
              className={`h-[46px] px-6 cursor-pointer shrink-0 ${copied ? "bg-[#8F0810] text-white" : "bg-[#8F0810]/80 text-[#F7F5E6]"}`}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            asChild
            variant={"outline"}
            className="w-full h-12 text-base font-medium border border-[#8F0810] text-[#8F0810]"
          >
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              Buka Langsung
            </a>
          </Button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-medium text-primary hover:text-[#8F0810] hover:bg-[#F7F5E6] cursor-pointer h-12 rounded-md transition-colors py-2"
          >
            Generate lagi
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-xl border-none bg-white/95 shadow-lg">
            <p className="text-sm text-gray-500">Memuat link…</p>
          </Card>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
