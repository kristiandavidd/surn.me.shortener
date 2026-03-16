import { redirect } from "next/navigation";
import { findLinkByCode, insertLink } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type HomeProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

async function generateUniqueCode() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++) {
    const candidate = Array.from({ length: 6 })
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)] ?? "a")
      .join("");

    const exists = await findLinkByCode(candidate);

    if (!exists) {
      return candidate;
    }
  }

  throw new Error("Gagal membuat kode pendek unik");
}

async function createShortUrl(formData: FormData) {
  "use server";

  const rawLong = formData.get("longUrl");
  const rawShort = formData.get("shortCode");

  if (typeof rawLong !== "string" || rawLong.trim().length === 0) {
    redirect("/?error=Long+URL+tidak+boleh+kosong");
  }

  let longUrl = rawLong.trim();

  if (!/^https?:\/\//i.test(longUrl)) {
    longUrl = `https://${longUrl}`;
  }

  let shortCode: string;

  if (typeof rawShort === "string" && rawShort.trim().length > 0) {
    const cleaned = rawShort
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/^at\.au\/?/i, "")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    if (!cleaned) {
      redirect("/?error=Short+URL+tidak+valid");
    }

    const exists = await findLinkByCode(cleaned);

    if (exists) {
      redirect("/?error=Short+URL+sudah+dipakai");
    }

    shortCode = cleaned;
  } else {
    shortCode = await generateUniqueCode();
  }

  await insertLink(shortCode, longUrl);

  redirect(
    `/success?code=${encodeURIComponent(shortCode)}&long=${encodeURIComponent(longUrl)}`
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const params = searchParams ? await searchParams : undefined;
  const error = params?.error;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-xl ">
        <div className="mb-6 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <Image src="/logo.svg" alt="surn.me" width={100} height={100} />
          </span>
          <h1 className="text-2xl font-semibold text-primary font-georgia">
            Shut The Damn Link — Shorten That Sh*t
          </h1>
          <p className="md:text-xs text-[10px] text-[#847353]">
            Just put your long annoying URL here. We&apos;ll handle it.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <form action={createShortUrl} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="longUrl">Long URL</Label>
            <Input
              id="longUrl"
              name="longUrl"
              type="url"
              required
              placeholder="https://fkin-long-url.com/v/asdjassdadasdlkasd"
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortCode">Short URL (opsional)</Label>
            <p className="md:text-xs text-[10px] text-[#847353]">
              Leave it blank to generate a random short URL.
            </p>
            <div className="flex items-center gap-1 mt-2">
              <div className="rounded-l-md bg-primary px-3 py-2 text-sm text-white">
                surn.me/
              </div>
              <Input
                id="shortCode"
                name="shortCode"
                type="text"
                placeholder="damn-short-link"
                className="rounded-none rounded-r-md"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Get Short URL
          </Button>
        </form>
      </Card>
    </div>
  );
}
