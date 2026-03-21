"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ToastHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const processedParams = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    const currentParams = searchParams.toString();

    // Jika params sama dengan yang sudah diproses, jangan tampilkan lagi
    if (processedParams.current === currentParams) return;

    if (error || success) {
      if (error) {
        toast.error(decodeURIComponent(error));
      }
      if (success) {
        toast.success(decodeURIComponent(success));
      }

      // Tandai params ini sudah diproses
      processedParams.current = currentParams;

      // Bersihkan URL
      const params = new URLSearchParams(currentParams);
      params.delete("error");
      params.delete("success");
      const newQuery = params.toString();
      const newUrl = `${pathname}${newQuery ? `?${newQuery}` : ""}`;
      
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}
