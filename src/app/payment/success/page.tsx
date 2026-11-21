
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your payment...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let ignore = false;

    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          throw new Error("Payment session ID is missing.");
        }

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please login to verify your payment.");
        }

        const response = await fetch(
          `${API_URL}/payments/verify-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenData.token}`,
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Payment verification failed.");
        }

        if (!ignore) {
          setSuccess(true);
          setMessage("Your payment has been successfully verified!");
        }
      } catch (error) {
        if (!ignore) {
          setSuccess(false);
          setMessage(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void verifyPayment();

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mb-5 text-6xl">
          {loading ? "⏳" : success ? "✅" : "❌"}
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          {loading
            ? "Verifying Payment"
            : success
              ? "Payment Successful!"
              : "Payment Verification Failed"}
        </h1>

        <p className="mt-3 text-slate-600">{message}</p>

        {!loading && (
          <div className="mt-8 flex flex-col gap-3">
            {success ? (
              <Link
                href="/dashboard/customer/payments"
                className="rounded-xl bg-lime-400 px-6 py-3 font-bold text-slate-900 hover:bg-lime-500"
              >
                View Payment History
              </Link>
            ) : (
              <button
                onClick={() => router.push("/dashboard/customer/bookings")}
                className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800"
              >
                Back to My Bookings
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
