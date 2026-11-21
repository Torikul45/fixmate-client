
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type AdminStats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTechnicians: 0,
    pendingServices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/overview`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load dashboard.");
        }

        setStats({
          totalUsers: result.totalUsers,
          totalTechnicians: result.totalTechnicians,
          pendingServices: result.pendingServices,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "bg-blue-50 text-blue-600",
      icon: "👥",
    },
    {
      title: "Total Technicians",
      value: stats.totalTechnicians,
      color: "bg-purple-50 text-purple-600",
      icon: "🛠️",
    },
    {
      title: "Pending Services",
      value: stats.pendingServices,
      color: "bg-amber-50 text-amber-600",
      icon: "⏳",
    },
  ];

  const adminActions = [
    { title: "Manage Users", href: "/dashboard/admin/users", icon: "👥" },
    { title: "Service Approval", href: "/dashboard/admin/services", icon: "🛠️" },
    { title: "All Bookings", href: "/dashboard/admin/bookings", icon: "📋" },
    { title: "Transactions", href: "/dashboard/admin/transactions", icon: "💳" },
    { title: "Update Profile", href: "/dashboard/profile", icon: "👤" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            ADMIN PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage users, approve services and monitor repair activities.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <span className={`rounded-xl p-3 text-xl ${card.color}`}>
                  {card.icon}
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-slate-900">
                {loading ? "..." : card.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Admin Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage all activities from one place.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-5 transition hover:border-teal-500 hover:bg-teal-50"
              >
                <span className="text-2xl">{action.icon}</span>

                <span className="font-semibold text-slate-700">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
