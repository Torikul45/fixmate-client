
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const dashboardMenus = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: "⌂" },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: "▣" },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: "$" },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: "⌂" },
    { label: "Add a Service", href: "/dashboard/technician/add-service", icon: "+" },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: "⚙" },
    { label: "Manage Requests", href: "/dashboard/technician/requests", icon: "▣" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: "⌂" },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: "♙" },
    { label: "Service Approval", href: "/dashboard/admin/services", icon: "✓" },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: "▣" },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: "$" },
  ],
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if (pathname.startsWith("/dashboard/customer") && role !== "customer") {
      router.replace(`/dashboard/${role || "customer"}`);
    } else if (
      pathname.startsWith("/dashboard/technician") &&
      role !== "technician"
    ) {
      router.replace(`/dashboard/${role || "customer"}`);
    } else if (
      pathname.startsWith("/dashboard/admin") &&
      role !== "admin"
    ) {
      router.replace(`/dashboard/${role || "customer"}`);
    }
  }, [isPending, user, role, pathname, router]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const validRole =
    role === "admin" || role === "technician" ? role : "customer";

  const menuItems = dashboardMenus[validRole];
  const userName = user.name || "User";
  const profileImage = user.image;

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/sign-in");
        },
        onError: () => {
          toast.error("Unable to sign out. Please try again.");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-7">
          <Link href="/" className="text-2xl font-extrabold text-teal-700">
            FixMate<span className="text-slate-900">.</span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-2xl text-slate-500 lg:hidden"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-7">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-base">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pathname === "/dashboard/profile"
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                ♙
              </span>
              Update Profile
            </Link>
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-teal-700"
          >
            <span>←</span>
            Back to Home
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
          >
            <span>↪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xl text-slate-700 lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Dashboard
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Welcome back, {userName}
              </p>
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Profile Picture */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-teal-100 text-sm font-bold text-teal-700">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt={`${userName}'s profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* Name and Email */}
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
                {userName}
              </p>
              <p className="max-w-40 truncate text-xs text-slate-500">
                {user.email}
              </p>
            </div>

            {/* Role Badge */}
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
              {validRole}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-5 sm:p-7 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}
