import { redirect } from "next/navigation";
import { findLinkByCode, insertLink, getLinksByUserId, createLinkTree, addLinkTreeItem, getLinkTreesByUserId, updateLinkTree, getLinkTreeWithItems, updateLink } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { DashboardClient } from "@/components/DashboardClient";
import { uploadImage } from "@/lib/r2";
import { LandingContent } from "@/components/LandingContent";
import { DashboardGuestShortener } from "@/components/DashboardGuestShortener";

type HomeProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
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

  const session = await getSession();

  const linkId = formData.get("linkId") as string;
  const rawLong = formData.get("longUrl") as string;
  const rawShort = formData.get("shortCode") as string;
  const rawTitle = formData.get("title") as string;

  if (linkId && session) {
    if (!rawLong || rawLong.trim().length === 0) {
      redirect("/?error=Long+URL+tidak+boleh+kosong");
    }
    let longUrl = rawLong.trim();
    if (!/^https?:\/\//i.test(longUrl)) {
      longUrl = `https://${longUrl}`;
    }
    await updateLink(linkId, session.user.id, rawTitle, longUrl);
    redirect("/?success=Link+berhasil+diperbarui");
  }

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

  await insertLink(shortCode, longUrl, session?.user?.id, rawTitle as string);

  if (session) {
    redirect("/?success=Link+berhasil+dibuat");
  }

  // Masking data menggunakan base64 agar lebih etis di URL (Hanya untuk Guest)
  const maskedData = Buffer.from(JSON.stringify({ code: shortCode, long: longUrl })).toString("base64");
  redirect(`/success?d=${encodeURIComponent(maskedData)}`);
}

async function handleCreateLinkTree(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session) redirect("/login");

  const treeId = formData.get("treeId") as string;
  const title = formData.get("treeTitle") as string;
  const description = formData.get("treeDescription") as string;
  const slug = formData.get("treeSlug") as string;
  const imageFile = formData.get("treeImage") as File;
  const itemTitles = formData.getAll("itemTitle[]") as string[];
  const itemUrls = formData.getAll("itemUrl[]") as string[];
  const itemIcons = formData.getAll("itemIcon[]") as string[];

  if (!title || (!treeId && !slug) || itemTitles.length === 0) {
    redirect("/?error=Judul, slug, dan minimal satu link harus diisi");
  }

  let imageUrl: string | undefined;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  } else {
    imageUrl = formData.get("existingImage") as string || undefined;
  }

  let finalTreeId = treeId;
  try {
    if (treeId) {
      await updateLinkTree(treeId, session.user.id, title, description, imageUrl);
    } else {
      finalTreeId = await createLinkTree(session.user.id, title, slug, description, imageUrl);
    }
    
    for (let i = 0; i < itemTitles.length; i++) {
      await addLinkTreeItem(finalTreeId, itemTitles[i]!, itemUrls[i]!, itemIcons[i] as string, i);
    }
  } catch (error) {
    console.error(error);
    redirect(`/?error=Slug+sudah+dipakai+atau+terjadi+kesalahan`);
  }

  redirect(`/?success=Link+Tree+berhasil+${treeId ? 'diperbarui' : 'dibuat'}`);
}

async function getTreeDetails(id: string) {
  "use server";
  const session = await getSession();
  if (!session) return null;
  return await getLinkTreeWithItems(id, session.user.id);
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await getSession();
  const params = searchParams ? await searchParams : undefined;
  const error = params?.error;
  const success = params?.success;

  const rawLinks = session ? await getLinksByUserId(session.user.id) : [];
  const rawTrees = session ? await getLinkTreesByUserId(session.user.id) : [];

  // Sanitasi data agar menjadi plain objects (menghindari error serialization)
  const links = rawLinks.map(link => ({
    id: String(link.id),
    shortCode: String(link.shortCode),
    longUrl: String(link.longUrl),
    title: link.title ? String(link.title) : null,
    createdAt: String(link.createdAt),
  }));

  const trees = rawTrees.map(tree => ({
    id: String(tree.id),
    slug: String(tree.slug),
    title: String(tree.title),
    description: tree.description ? String(tree.description) : null,
    image: tree.image ? String(tree.image) : null,
    createdAt: String(tree.createdAt),
  }));

  if (session) {
    return (
      <DashboardClient 
        links={links} 
        trees={trees} 
        error={error} 
        success={success}
        createShortUrl={createShortUrl}
        handleCreateLinkTree={handleCreateLinkTree}
        getTreeDetails={getTreeDetails}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <DashboardGuestShortener createShortUrl={createShortUrl} />
      </div>
      
      {/* Landing Page Content for Guests */}
      <div className="bg-[#DDDBCD]/30 border-t border-[#DCC9A6]/30">
        <LandingContent />
      </div>
    </div>
  );
}
