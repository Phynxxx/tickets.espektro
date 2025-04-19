import { Metadata } from "next";
import Image from "next/image";
import { ShineBorder } from "@/app/components/magicui/shine-border";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/app/components/ui/button";
import { GoogleButton } from "@/app/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login - Espektro Ticketing System",
  description: "Login to your Espektro account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-4xl flex-col md:flex-row lg:flex-row">
          {/* Left section - Illustration */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-10 rounded-l-lg">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">Welcome to Espektro</h1>
              <p className="text-white/90 mb-8">Sign in to access your tickets and manage your event experience.</p>
              <div className="relative w-full h-64">
                <Image
                  src="/espektro-logo-white.png"
                  alt="Login illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right section - OAuth login */}
          <div className="relative w-full md:w-1/2 bg-white dark:bg-slate-900 shadow-xl rounded-lg md:rounded-l-none md:rounded-r-lg overflow-hidden">
            <ShineBorder
              className="absolute inset-0"
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            />
            <div className="flex flex-col items-center justify-center p-8 md:p-12 h-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Sign in to Espektro</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Access your tickets with Google account
                </p>
              </div>

              <GoogleButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


