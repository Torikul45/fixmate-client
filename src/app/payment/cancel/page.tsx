
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mb-5 text-6xl">⚠️</div>

        <h1 className="text-2xl font-bold text-slate-900">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-slate-600">
          Your payment was cancelled. No payment has been processed.
          You can return to your bookings and try again.
        </p>

        {bookingId && (
          <p className="mt-3 break-all text-xs text-slate-400">
            Booking ID: {bookingId}
          </p>
        )}

        <Link
          href="/dashboard/customer/bookings"
          className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800"
        >
          Back to My Bookings
        </Link>
      </div>
    </div>
  );
}
