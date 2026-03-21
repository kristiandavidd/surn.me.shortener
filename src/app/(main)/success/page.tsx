/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconCheck, IconCopy, IconExternalLink, IconRefresh } from "@tabler/icons-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  // Decode data dari masking base64
  const data = useMemo(() => {
    const d = searchParams.get("d");
    if (!d) return null;
    try {
      return JSON.parse(atob(decodeURIComponent(d)));
    } catch {
      return null;
    }
  }, [searchParams]);

  const code = data?.code ?? "";

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
      toast.success("Short link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-2xl bg-[#F7F5E6] p-8 md:p-12 rounded-[40px] border border-[#DCC9A6] shadow-2xl shadow-brown/10">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-100">
            <IconCheck className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 font-georgia">
            Link Berhasil Dibuat!
          </h1>
          <p className="text-brown/60 font-medium text-lg">
            Sekarang kamu bisa membagikan link ini ke teman-temanmu.
          </p>
        </div>

        <div className="mb-10 space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-brown/40 ml-1">
            SHORT URL
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-2xl bg-white px-5 py-4 font-mono text-base text-primary whitespace-nowrap overflow-hidden text-ellipsis border border-[#DCC9A6] shadow-inner"
              title={shortUrl}
            >
              {shortUrl}
            </div>
            <Button
              type="button"
              onClick={handleCopy}
              className={`h-14 px-8 rounded-2xl font-bold transition-all shadow-lg ${
                copied 
                  ? "bg-green-600 text-white shadow-green-200" 
                  : "bg-primary text-[#F7F5E6] hover:bg-primary/90 shadow-primary/20"
              }`}
            >
              {copied ? <IconCheck size={24} /> : <IconCopy size={24} />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            asChild
            className="h-14 text-lg font-bold bg-[#F7F5E6] border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl transition-all shadow-md"
          >
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              <IconExternalLink size={20} className="mr-2" /> Buka Link
            </a>
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="h-14 text-lg font-bold bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-2xl transition-all shadow-lg shadow-primary/20"
          >
            <IconRefresh size={20} className="mr-2" /> Buat Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12 md:py-20">
          <div className="w-full max-w-2xl bg-[#F7F5E6] p-8 md:p-12 rounded-[40px] border border-[#DCC9A6] shadow-2xl shadow-brown/10 flex items-center justify-center">
            <p className="text-lg font-medium text-brown/60 animate-pulse">Memuat link...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
