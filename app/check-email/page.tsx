import Image from "next/image";

export default function CheckEmailPage() {
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
          Check your email
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          We've sent you a confirmation link. Please check your inbox and follow
          the instructions to activate your account.
        </p>
        <a
          href="/login"
          className="text-brand-ember font-medium hover:underline"
        >
          Back to login
        </a>
      </div>
    </main>
  );
}
