"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const result = await register(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setRegisteredEmail(email);
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-primary font-georgia">Daftar</h1>
          <p className="text-sm text-gray-500">Buat akun surn.me kamu</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-center">
            <h2 className="text-lg font-semibold text-green-800">Cek Email Kamu!</h2>
            <p className="mt-2 text-sm text-green-700">
              Kami telah mengirimkan tautan verifikasi ke {registeredEmail}.
              Silakan verifikasi email kamu sebelum login.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/login">Kembali ke Login</Link>
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Budi Santoso"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Daftar Akun"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login di sini
              </Link>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
