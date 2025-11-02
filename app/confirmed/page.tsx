import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function ConfirmPage() {
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

        <div className="mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-brand-mint/20 rounded-full animate-ping"></div>
          </div>
          <CheckCircle2 className="h-20 w-20 text-brand-mint relative z-10" />
        </div>

        <h1 className="text-2xl font-bold text-brand-charcoal mb-2 text-center">
          Email Confirmed! 🎉
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Your account has been successfully verified. You&apos;re all set to
          start your fitness journey!
        </p>

        <Link href="/login" className="w-full">
          <Button className="w-full bg-brand-ember hover:bg-brand-ember/90">
            Continue to Login
          </Button>
        </Link>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Ready to track your workouts and reach your goals! 💪
        </p>
      </div>
    </main>
  );
}
