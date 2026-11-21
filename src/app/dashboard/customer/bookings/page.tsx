
"use client";

import {  useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { X, AlertTriangle } from "lucide-react";

type Booking = {
  _id: string;
  serviceTitle: string;
  category: string;
  technicianName: string;
  preferredDate: string;
  basePrice: number;
  finalAmount: number | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  requested: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  "in-progress": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Customer Bookings
 
  useEffect(() => {
    let ignore = false;

    const fetchBookings = async () => {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please login to view your bookings.");
        }

        const response = await fetch(`${API_URL}/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load bookings.");
        }

        if (!ignore) {
          setBookings(result.bookings || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchBookings();

    return () => {
      ignore = true;
    };
  }, [API_URL]);


  // Cancel Booking
  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;

    try {
      setCancelling(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API_URL}/bookings/${cancelBookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === cancelBookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully!");
      setCancelBookingId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setCancelling(false);
    }
  };

  // Stripe Payment
  const handlePayment = async (bookingId: string) => {
    try {
      setPayingBookingId(bookingId);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to start payment.");
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL not found.");
      }

      window.location.assign(result.url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment failed."
      );
      setPayingBookingId(null);
    }
  };

  // Booking Statistics
  const activeJobs = bookings.filter((booking) =>
    ["requested", "accepted", "in-progress"].includes(booking.status)
  ).length;

  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div>
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Bookings
        </h1>
        <p className="mt-2 text-slate-500">
          Track and manage all your repair requests.
        </p>
      </div>

      {/* Booking Statistics */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Jobs</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {activeJobs}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed Jobs</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {completedJobs}
          </h2>
        </div>
      </div>

      {/* Booking History */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Booking History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              All your repair service requests.
            </p>
          </div>

          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
            {bookings.length} Bookings
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-500">
              Loading your bookings...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl">🔧</div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No bookings yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your repair requests will appear here.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-block rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-teal-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Booking ID: {booking._id}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      {booking.serviceTitle}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.category} ·{" "}
                      {booking.technicianName || "Technician not assigned"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      statusStyles[booking.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {booking.status.replace("-", " ")}
                  </span>
                </div>

                {/* Booking Information */}
                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      Preferred Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {booking.preferredDate
                        ? new Date(
                            `${booking.preferredDate}T00:00:00`
                          ).toLocaleDateString()
                        : "Not scheduled"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Amount</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      $
                      {(
                        booking.finalAmount ??
                        booking.basePrice ??
                        0
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Payment</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>

                {/* Cancel Booking */}
                {booking.status === "requested" && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setCancelBookingId(booking._id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                {/* Pay Now */}
                {booking.status === "completed" &&
                  booking.paymentStatus === "unpaid" && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-lg bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                          Ready for Payment
                        </span>

                        <button
                          onClick={() => handlePayment(booking._id)}
                          disabled={payingBookingId !== null}
                          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {payingBookingId === booking._id
                            ? "Redirecting..."
                            : "Pay Now"}
                        </button>
                      </div>
                    </div>
                  )}

                {/* Paid Status */}
                {booking.paymentStatus === "paid" && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <span className="inline-block rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                      Payment Completed
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setCancelBookingId(null)}
              disabled={cancelling}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Cancel Booking?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to cancel this repair request? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCancelBookingId(null)}
                disabled={cancelling}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
