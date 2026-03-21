import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { nanoid } from "nanoid";
import { cache } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          verified: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } });
    }
    return null;
  }

  return session;
});

export async function createSession(userId: string) {
  const sessionId = nanoid(32);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionId;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    cookieStore.delete("session_id");
  }
}

export async function sendVerificationEmail(email: string, name: string) {
  const token = nanoid(40);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/api/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Surn.me <no-reply@notify.surn.me>",
    to: email,
    subject: "Verify your email address - Surn.me",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #F7F5E6; border: 1px solid #DCC9A6; border-radius: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #7C2D12; font-size: 32px; margin-bottom: 10px;">Welcome to Surn.me</h1>
          <p style="color: #7C2D12; opacity: 0.6; font-weight: 500;">Your minimalist link shortener & link tree</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px; border-radius: 32px; border: 1px solid #DCC9A6; box-shadow: 0 10px 15px -3px rgba(124, 45, 18, 0.05);">
          <h2 style="color: #7C2D12; font-size: 24px; margin-bottom: 20px;">Hi ${name},</h2>
          <p style="color: #7C2D12; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
            Thank you for joining Surn.me! We're excited to have you on board. To start shortening your links and building your personalized link tree, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${verificationUrl}" style="display: inline-block; background-color: #7C2D12; color: #F7F5E6; padding: 16px 40px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 10px 15px -3px rgba(124, 45, 18, 0.2);">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #7C2D12; opacity: 0.6; font-size: 14px; line-height: 1.5;">
            If the button doesn't work, you can also copy and paste the following link into your browser:<br>
            <a href="${verificationUrl}" style="color: #7C2D12; text-decoration: underline;">${verificationUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #7C2D12; opacity: 0.5; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Surn.me. All rights reserved.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}
