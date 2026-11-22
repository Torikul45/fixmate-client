
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });
    } catch {
      toast.error("Google sign-up failed. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      formData.password.length < 6 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password)
    ) {
      toast.error(
        "Password must be at least 6 characters and contain uppercase and lowercase letters.",
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");

      if (formData.role === "technician") {
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
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join FixMate and get your devices repaired easily.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-teal-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-700"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-teal-600"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-700"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Register As */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Register As
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-600"
            >
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-700 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-teal-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
