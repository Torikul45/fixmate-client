
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  status: string;
};

export default function CustomerDashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: tokenData, error } = await authClient.token();

        if (error || !tokenData?.token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load customer bookings.");
        }

        const data = await response.json();
        const bookings: Booking[] = data.bookings || [];

        setTotalRequests(bookings.length);

        setActiveJobs(
          bookings.filter(
            (booking) =>
              booking.status === "accepted" ||
              booking.status === "in-progress",
          ).length,
        );

        setCompletedJobs(
          bookings.filter((booking) => booking.status === "completed").length,
        );
      } catch (error) {
        console.error("Customer Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Customer Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome to your FixMate dashboard.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Requests</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? "..." : totalRequests}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Active Jobs</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? "..." : activeJobs}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Completed Jobs</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? "..." : completedJobs}
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Quick Actions
        </h2>

        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href="/services"
            className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800"
          >
            Browse Services
          </Link>

          <Link
            href="/dashboard/customer/bookings"
            className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
