
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { error, data } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.success("Signed in successfully!");

      const role = data.user.role;

      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");

      if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
        router.replace(returnTo);
      } else if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "technician") {
        router.replace("/dashboard/technician");
      } else {
        router.replace("/dashboard/customer");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-start justify-center bg-slate-50 px-4 pb-12 pt-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-extrabold text-teal-700">
            FixMate.
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your repair services.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-700 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.02 13.22l7.98 6.19C12.91 13.72 18.01 9.5 24 9.5Z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.93 46.98 31.77 46.98 24.55Z"
            />
            <path
              fill="#FBBC05"
              d="M10.99 28.59A14.4 14.4 0 0 1 10.2 24c0-1.59.28-3.13.78-4.59L3 13.22A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l8.43-6.19Z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-5.99 0-11.09-4.22-12.91-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-teal-700 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
