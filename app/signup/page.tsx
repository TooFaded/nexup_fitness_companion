"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; // <-- use client here!
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);

  async function signup(formData: FormData) {
    setError(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    console.log("data:", data);
    console.log("error:", error);

    if (error) {
      setError(error.message);
      return "error";
    }

    // Check if user already exists (session is null but user exists)
    if (data.user && !data.session) {
      setError(
        "An account with this email already exists. Please sign in or check your email for confirmation."
      );
      return "error";
    }

    // If user is created successfully with a session
    if (data.user && data.session) {
      return "success";
    }

    setError("Could not create account. Please try again.");
    return "error";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <Image
          src="/nexup_logo.svg"
          alt="Nexup Logo"
          width={64}
          height={64}
          className="mb-6"
        />
        <h1 className="text-2xl font-bold text-brand-charcoal mb-2 text-center">
          Create your Nexup account
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          Start your fitness journey today
        </p>
        <form
          className="w-full space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await signup(new FormData(e.currentTarget));

            // Log the result and wait before redirecting
            console.log("Result:", result);

            // Only redirect if signup was successful
            if (result === "success") {
              // Add a delay so you can see the console
              await new Promise((resolve) => setTimeout(resolve, 5000)); // 3 second delay
              window.location.href = "/check-email";
            }
          }}
        >
          <Input name="email" type="email" placeholder="Email" required />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <Button
            type="submit"
            className="w-full bg-brand-mint hover:bg-brand-mint/90"
          >
            Sign Up
          </Button>
        </form>
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        <div className="mt-6 text-center">
          <span className="text-gray-500">Already have an account?</span>{" "}
          <a
            href="/login"
            className="text-brand-ember font-medium hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>
    </main>
  );
}
