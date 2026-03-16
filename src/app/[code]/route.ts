import { NextRequest, NextResponse } from "next/server";
import { findLinkByCode } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const link = await findLinkByCode(code);

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  let target = link.longUrl;

  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  return NextResponse.redirect(target);
}
