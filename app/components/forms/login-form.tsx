"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

// Define the form schema with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
);

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      // Here you would normally send the data to your authentication endpoint
      console.log("Login attempt with:", data);

      // Mock successful login - replace this with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to homepage or dashboard after login
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Welcome back
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
        Enter your credentials to sign in
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="my-8 space-y-6">
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in →"}
          <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </button>
      </form>
      <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export function GoogleButton() {
  "use client";
  return <Button
    onClick={() => authClient.signIn.social({ provider: "google", newUserCallbackURL: "/signup" })}
    className="flex items-center gap-2 w-full max-w-xs"
    variant="outline"
    size="lg"
  >
    <Image
      src="/google-logo.svg"
      alt="Google"
      width={20}
      height={20} />
    <span>Continue with Google</span>
  </Button>;
}