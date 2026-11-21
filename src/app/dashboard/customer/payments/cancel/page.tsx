
"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 sm:p-10 text-center shadow-xl">
        <XCircle className="mx-auto h-20 w-20 text-amber-500" />

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-4 leading-7 text-gray-600">
          Your payment was not completed. No payment has been recorded.
          You can return to your bookings and try again whenever you are ready.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/customer/bookings"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <CreditCard size={19} />
            Return to My Bookings
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={19} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
