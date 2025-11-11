"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function login(formData: FormData) {
    setError(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return "error";
    }

    return "success";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card dark:bg-dark-card rounded-xl shadow-lg p-8 flex flex-col items-center border border-border">
        <Image
          src="/nexup_logo.svg"
          alt="Nexup Logo"
          width={64}
          height={64}
          className="mb-6 dark:hidden"
        />
        <Image
          src="/nexup-white.svg"
          alt="Nexup Logo"
          width={64}
          height={64}
          className="mb-6 hidden dark:block"
        />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sign in to Nexup
        </h1>
        <p className="text-muted-foreground mb-6 text-center">
          Your fitness companion
        </p>
        <form
          className="w-full space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await login(new FormData(e.currentTarget));
            if (result === "success") {
              window.location.href = "/";
            }
          }}
        >
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="bg-background text-foreground border-border"
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="bg-background text-foreground border-border"
          />
          <Button
            type="submit"
            className="w-full bg-brand-ember hover:bg-brand-ember/90 text-white"
          >
            Sign In
          </Button>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-center text-sm">{error}</div>
        )}
        <div className="mt-6 text-center">
          <span className="text-muted-foreground">Not signed up yet?</span>{" "}
          <a
            href="/signup"
            className="text-brand-mint font-medium hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </main>
  );
}
