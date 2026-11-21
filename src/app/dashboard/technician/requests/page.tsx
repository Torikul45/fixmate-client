
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  ClipboardList,
  RefreshCw,
  Loader2,
  CalendarDays,
  MapPin,
  Phone,
  User,
  DollarSign,
  Play,
  Check,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  category?: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  basePrice: number;
  finalAmount: number | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [completeBookingId, setCompleteBookingId] = useState<string | null>(
    null
  );
  const [finalAmount, setFinalAmount] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/bookings/technician-requests`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load booking requests.");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Load Technician Requests Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBookings();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadBookings]);

  const updateBookingStatus = async (
    bookingId: string,
    status: string,
    amount?: number
  ) => {
    try {
      setBusyId(bookingId);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            status,
            ...(amount !== undefined ? { finalAmount: amount } : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking.");
      }

      toast.success(data.message || "Booking updated successfully.");

      setCompleteBookingId(null);
      setFinalAmount("");

      await loadBookings();
    } catch (error) {
      console.error("Update Booking Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update booking."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleCompleteJob = (bookingId: string) => {
    const amount = Number(finalAmount);

    if (!finalAmount.trim() || !Number.isFinite(amount) || amount <= 0) {
      toast.error("Please enter a valid final amount.");
      return;
    }

    updateBookingStatus(bookingId, "completed", amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-amber-100 text-amber-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const activeCount = bookings.filter((booking) =>
    ["accepted", "in-progress"].includes(booking.status)
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-[#f5f8fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-teal-700">
              Technician Workspace
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Requests
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Review customer requests and manage your repair jobs.
            </p>
          </div>

          <button
            onClick={loadBookings}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {pendingCount}
                </h2>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Jobs</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {activeCount}
                </h2>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Wrench size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Jobs</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {completedCount}
                </h2>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Requests */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Booking Requests
              </h2>
              <p className="text-sm text-gray-500">
                {bookings.length} total booking
                {bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={35} className="animate-spin text-teal-700" />
              <p className="mt-4 text-sm text-gray-500">
                Loading booking requests...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
              <ClipboardList
                size={45}
                className="mx-auto text-gray-300"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No Booking Requests Yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Customer requests for your services will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-gray-200 p-5 transition hover:border-teal-200 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {booking.serviceTitle}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status.replace("-", " ")}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        {booking.category || "Repair Service"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 px-4 py-3">
                      <p className="text-xs text-gray-500">Base Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${Number(booking.basePrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="my-5 grid grid-cols-1 gap-4 border-y border-gray-100 py-5 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <User size={18} className="mt-1 text-teal-700" />
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="font-semibold text-gray-800">
                          {booking.customerName || "Customer"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.customerEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone size={18} className="mt-1 text-teal-700" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">
                          {booking.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={18}
                        className="mt-1 text-teal-700"
                      />
                      <div>
                        <p className="text-xs text-gray-500">
                          Preferred Date
                        </p>
                        <p className="font-medium text-gray-800">
                          {booking.preferredDate
                            ? new Date(
                                `${booking.preferredDate}T00:00:00`
                              ).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-1 text-teal-700" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-medium text-gray-800">
                          {booking.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="mb-2 text-sm font-semibold text-gray-800">
                      Problem Description
                    </p>
                    <p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                      {booking.problemDescription}
                    </p>
                  </div>

                  {booking.status === "completed" && (
                    <div className="mb-5 flex items-center justify-between rounded-xl bg-emerald-50 p-4">
                      <span className="text-sm font-medium text-emerald-800">
                        Final Amount
                      </span>
                      <span className="text-lg font-bold text-emerald-800">
                        ${Number(booking.finalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {booking.status === "requested" && (
                      <>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "accepted")
                          }
                          disabled={busyId === booking._id}
                          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
                        >
                          <CheckCircle size={17} />
                          Accept Request
                        </button>

                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "rejected")
                          }
                          disabled={busyId === booking._id}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={17} />
                          Reject Request
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          updateBookingStatus(booking._id, "in-progress")
                        }
                        disabled={busyId === booking._id}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Play size={17} />
                        Start Job
                      </button>
                    )}

                    {booking.status === "in-progress" && (
                      <button
                        onClick={() => {
                          setCompleteBookingId(booking._id);
                          setFinalAmount(
                            String(booking.basePrice || "")
                          );
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <Check size={17} />
                        Complete Job
                      </button>
                    )}

                    {booking.status === "cancelled" && (
                      <p className="text-sm font-medium text-red-600">
                        This booking was cancelled by the customer.
                      </p>
                    )}

                    {booking.status === "rejected" && (
                      <p className="text-sm font-medium text-red-600">
                        You rejected this booking request.
                      </p>
                    )}

                    {booking.status === "completed" && (
                      <p className="text-sm font-medium text-emerald-700">
                        <CheckCircle size={16} className="mr-1 inline" />
                        Job completed. Waiting for customer payment.
                      </p>
                    )}
                  </div>

                  {/* Final Amount Form */}
                  {completeBookingId === booking._id && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Enter Final Repair Amount ($)
                      </label>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                          <DollarSign
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={finalAmount}
                            onChange={(event) =>
                              setFinalAmount(event.target.value)
                            }
                            placeholder="Enter final amount"
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                          />
                        </div>

                        <button
                          onClick={() =>
                            handleCompleteJob(booking._id)
                          }
                          disabled={busyId === booking._id}
                          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {busyId === booking._id
                            ? "Saving..."
                            : "Confirm Completion"}
                        </button>

                        <button
                          onClick={() => {
                            setCompleteBookingId(null);
                            setFinalAmount("");
                          }}
                          className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
