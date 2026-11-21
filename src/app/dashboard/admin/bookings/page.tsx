
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Booking = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName?: string;
  technicianEmail?: string;
  preferredDate: string;
  phone: string;
  address: string;
  basePrice: number;
  finalAmount?: number | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

const bookingStatuses = [
  "all",
  "requested",
  "accepted",
  "rejected",
  "cancelled",
  "in-progress",
  "completed",
];

const paymentStatuses = ["all", "paid", "unpaid"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");

  useEffect(() => {
    let ignore = false;

    const fetchBookings = async () => {
      setLoading(true);

      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please login as admin.");
        }

        const params = new URLSearchParams({
          status,
          paymentStatus,
        });

        const response = await fetch(
          `${API_URL}/admin/bookings?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load bookings."
          );
        }

        if (!ignore) {
          setBookings(result.bookings || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void fetchBookings();

    return () => {
      ignore = true;
    };
  }, [status, paymentStatus]);

  const getStatusStyle = (value: string) => {
    switch (value) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-700";
      case "requested":
      case "accepted":
      case "in-progress":
      case "unpaid":
        return "bg-amber-100 text-amber-700";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          All Bookings
        </h1>
        <p className="mt-2 text-slate-600">
          View all customer service bookings.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Booking Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-lime-500"
          >
            {bookingStatuses.map((item) => (
              <option key={item} value={item}>
                {item === "all"
                  ? "All Statuses"
                  : item.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-lime-500"
          >
            {paymentStatuses.map((item) => (
              <option key={item} value={item}>
                {item === "all"
                  ? "All Payment Statuses"
                  : item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            Bookings Management
          </h2>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {bookings.length} Bookings
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl">📋</div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No bookings found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              No booking records match your selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {booking.serviceTitle || "Repair Service"}
                    </h3>
                    <p className="mt-1 break-all text-xs text-slate-400">
                      Booking ID: {booking._id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-slate-500">Customer</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {booking.customerName || "N/A"}
                    </p>
                    <p className="break-all text-slate-500">
                      {booking.customerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Technician</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {booking.technicianName || "Not assigned"}
                    </p>
                    <p className="break-all text-slate-500">
                      {booking.technicianEmail || ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Preferred Date</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {booking.preferredDate
                        ? new Date(
                            `${booking.preferredDate}T00:00:00`
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Phone</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {booking.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Address</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {booking.address || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Amount</p>
                    <p className="mt-1 font-bold text-slate-900">
                      $
                      {Number(
                        booking.finalAmount ?? booking.basePrice ?? 0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-500">
                    Booked:{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(booking.paymentStatus)}`}
                  >
                    Payment: {booking.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
