import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    redirect("/login?error=Token tidak valid");
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    if (verificationToken) {
      await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
    }
    redirect("/login?error=Token kedaluwarsa atau tidak valid");
  }

  await prisma.user.update({
    where: { email: verificationToken.email },
    data: { verified: true },
  });

  await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

  redirect("/login?success=Email berhasil diverifikasi. Silakan login.");
}
