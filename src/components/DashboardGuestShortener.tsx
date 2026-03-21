"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DashboardGuestShortener({ createShortUrl }: { createShortUrl: (formData: FormData) => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-2xl bg-[#F7F5E6] p-8 lg:p-12 rounded-[40px] border border-[#DCC9A6] shadow-2xl shadow-brown/10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-georgia">
          Shorten Your Link
        </h1>
        <p className="text-brown/60 text-lg font-medium">
          Just put your long annoying URL here. We&apos;ll handle it.
        </p>
      </div>

      <form 
        onSubmit={() => setLoading(true)}
        action={createShortUrl} 
        className="space-y-8"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="longUrl" className="text-brown font-semibold text-base ml-1">Long URL</Label>
            <Input
              id="longUrl"
              name="longUrl"
              type="url"
              required
              disabled={loading}
              placeholder="https://your-long-link/..."
              className="bg-white border-[#DCC9A6] focus:ring-primary h-14 rounded-2xl text-base px-5 shadow-sm disabled:bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortCode" className="text-brown font-semibold text-base ml-1">Custom Alias</Label>
            <div className="flex items-center group">
              <div className="bg-[#DCC9A6]/20 px-5 h-14 flex items-center text-sm font-bold text-primary border border-r-0 border-[#DCC9A6] rounded-l-2xl group-focus-within:border-primary/50 transition-colors shrink-0">
                surn.me/
              </div>
              <Input
                id="shortCode"
                name="shortCode"
                type="text"
                disabled={loading}
                placeholder="shorten-link"
                className="bg-white border-[#DCC9A6] focus:ring-primary h-14 rounded-none rounded-r-2xl text-base px-5 shadow-sm w-full disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-16 bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-[24px] font-bold text-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
        >
          {loading ? "Memproses..." : "Get Short URL"}
        </Button>
      </form>
    </div>
  );
}
