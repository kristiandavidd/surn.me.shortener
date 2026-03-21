"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            Register
          </h1>
          <p className="text-brown/60 font-medium">
            Create your surn.me account
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 font-medium"
          >
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-[32px] bg-green-50 border border-green-100 p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-green-800 font-georgia mb-3">
              Check Your Email!
            </h2>
            <p className="text-green-700 font-medium leading-relaxed mb-8">
              We have sent a verification link to{" "}
              <span className="font-bold">{registeredEmail}</span>. Please
              verify your email before logging in.
            </p>
            <Button
              asChild
              className="w-full h-14 bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-2xl font-bold text-lg shadow-lg"
            >
              <Link href="/login">Back to Login</Link>
            </Button>
          </motion.div>
        ) : (
          <>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-brown font-semibold ml-1">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="bg-white border-[#DCC9A6] focus:ring-primary h-12 md:h-14 rounded-2xl text-base px-5 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-brown font-semibold ml-1"
                >
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
                    minLength={8}
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
                {loading ? "Processing..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-8 text-center text-brown/60 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Login here
              </Link>
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
