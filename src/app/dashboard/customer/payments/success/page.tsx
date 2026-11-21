"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your payment...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          throw new Error("Payment session ID is missing.");
        }

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          router.replace("/sign-in?returnTo=/dashboard/customer/bookings");
          return;
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

        if (active) {
          setSuccess(true);
          setMessage("Your payment has been successfully verified!");
        }
      } catch (error) {
        if (active) {
          setSuccess(false);
          setMessage(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    verifyPayment();

    return () => {
      active = false;
    };
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 sm:p-10 text-center shadow-xl">
        {loading ? (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Verifying Payment
            </h1>
          </>
        ) : success ? (
          <>
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Successful!
            </h1>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-20 w-20 text-red-500" />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Verification Failed
            </h1>
          </>
        )}

        <p className="mt-4 text-gray-600">{message}</p>

        {!loading && (
          <div className="mt-8 flex flex-col gap-3">
            {success ? (
              <Link
                href="/dashboard/customer/bookings"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                View My Bookings
              </Link>
            ) : (
              <button
                onClick={() => router.push("/dashboard/customer/bookings")}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Back to My Bookings
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
