
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Menu,
  X,
  Wrench,
  LayoutDashboard,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const user = session?.user;
  const userImage = user?.image;
  const role = (user as { role?: string } | undefined)?.role;

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const validRole =
    role === "admin" || role === "technician" ? role : "customer";

  const dashboardPath =
    validRole === "admin"
      ? "/dashboard/admin"
      : validRole === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How it works", href: "/#how-it-works" },
  ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut();

      toast.success("Signed out successfully!");

      setProfileMenu(false);
      setMobileMenu(false);

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setProfileMenu(false);
    setMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex h-18.25 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-teal-700"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
            <Wrench size={22} />
          </span>

          FixMate<span className="text-slate-900">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "text-teal-700 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-orange-500"
                  : "text-slate-600 hover:text-teal-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Profile */}
        <div className="hidden items-center md:flex">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenu(!profileMenu)}
                aria-label="Open profile menu"
                aria-expanded={profileMenu}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-slate-100"
              >
                {/* Profile Picture */}
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={`${userName}'s profile`}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                    {initials}
                  </span>
                )}

                <ChevronDown
                  size={17}
                  className={`text-slate-500 transition-transform ${
                    profileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenu && (
                <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                  {/* User Information */}
                  <div className="border-b border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      {userImage ? (
                        <Image
                          src={userImage}
                          alt={`${userName}'s profile`}
                          width={48}
                          height={48}
                          unoptimized
                          className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                          {initials}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {userName}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {userEmail}
                        </p>

                        <span className="mt-1 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize text-teal-700">
                          {validRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="p-2">
                    <Link
                      href={dashboardPath}
                      onClick={() => setProfileMenu(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                    >
                      <LayoutDashboard size={18} />
                      My Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileMenu(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                    >
                      <UserRound size={18} />
                      Update Profile
                    </Link>

                    <div className="my-2 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:text-teal-700"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-2">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-lg px-4 py-3 text-sm font-semibold ${
                  isActive(link.href)
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="my-2 border-t border-slate-200" />

            {isPending ? (
              <p className="px-4 py-3 text-sm text-slate-500">
                Loading...
              </p>
            ) : user ? (
              <>
                {/* Mobile User Information */}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={`${userName}'s profile`}
                      width={44}
                      height={44}
                      unoptimized
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                      {initials}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                    <span className="text-xs font-semibold capitalize text-teal-700">
                      {validRole}
                    </span>
                  </div>
                </div>

                <Link
                  href={dashboardPath}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  <LayoutDashboard size={18} />
                  My Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  <UserRound size={18} />
                  Update Profile
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={closeMenus}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-teal-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
