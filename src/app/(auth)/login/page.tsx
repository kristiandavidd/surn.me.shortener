"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  
  const queryError = searchParams.get("error");
  const querySuccess = searchParams.get("success");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[480px]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-8"
      >
        <Link
          href="/"
          className="bg-[#F7F5E6] rounded-full p-4 border border-[#DCC9A6] shadow-2xl shadow-brown/10"
        >
          <Image
            src="/logo.svg"
            alt="surn.me"
            width={120}
            height={120}
            priority
            className="w-32 h-auto"
          />
        </Link>
      </motion.div>
      <div className="bg-[#F7F5E6] rounded-[40px] p-8 md:p-12 border border-[#DCC9A6] shadow-2xl shadow-brown/10">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 font-georgia">
            Login
          </h1>
          <p className="text-brown/60 font-medium">
            Sign in to your surn.me account
          </p>
        </div>

        {(error || queryError) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 font-medium"
          >
            {error || queryError}
          </motion.div>
        )}

        {querySuccess && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 rounded-2xl bg-green-50 border border-green-100 p-4 text-sm text-green-600 font-medium"
          >
            {querySuccess}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-brown font-semibold ml-1">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="bg-white border-[#DCC9A6] focus:ring-primary h-12 md:h-14 rounded-2xl text-base px-5 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              title="Password"
              className="text-brown font-semibold ml-1"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="bg-white border-[#DCC9A6] focus:ring-primary h-12 md:h-14 rounded-2xl text-base px-5 pr-12 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brown/40 hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <IconEyeOff size={20} />
                ) : (
                  <IconEye size={20} />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-14 bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign In Now"}
          </Button>
        </form>

        <p className="mt-8 text-center text-brown/60 font-medium">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline underline-offset-4"
          >
            Register here
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
