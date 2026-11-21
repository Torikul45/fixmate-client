"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Service = {
  _id: string;
  approvalStatus: string;
};

type Booking = {
  _id: string;
  status: string;
};

export default function TechnicianDashboard() {
  const [totalServices, setTotalServices] = useState(0);
  const [approvedServices, setApprovedServices] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: tokenData, error } = await authClient.token();

        if (error || !tokenData?.token) {
          throw new Error("Please login first.");
        }

        const token = tokenData.token;
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const [servicesResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_URL}/services/my-services`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/bookings/technician-requests`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!servicesResponse.ok || !bookingsResponse.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const servicesData = await servicesResponse.json();
        const bookingsData = await bookingsResponse.json();

        const services: Service[] = servicesData.services || [];
        const bookings: Booking[] = bookingsData.bookings || [];

        setTotalServices(services.length);

        setApprovedServices(
          services.filter(
            (service) => service.approvalStatus === "approved",
          ).length,
        );

        setPendingRequests(
          bookings.filter((booking) => booking.status === "requested").length,
        );
      } catch (error) {
        console.error("Technician Dashboard Error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-teal-700">
            FixMate.
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-teal-700"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">
          Technician Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your repair services and customer requests.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Services</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "..." : totalServices}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Approved Services</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "..." : approvedServices}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending Requests</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "..." : pendingRequests}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-5 flex flex-wrap gap-4">
            <Link
              href="/dashboard/technician/add-service"
              className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800"
            >
              Add New Service
            </Link>

            <Link
              href="/services"
              className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
