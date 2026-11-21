import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 text-2xl font-bold text-white"
            >
              <Wrench className="h-7 w-7 text-teal-500" />
              FixMate.
            </Link>
            <p className="max-w-xs text-sm leading-7 text-slate-400">
              Your trusted partner for smart device and home appliance repair
              services.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-teal-400">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-teal-400">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Our Services</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/services"
                  className="transition hover:text-teal-400"
                >
                  Smartphone & Laptop Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition hover:text-teal-400"
                >
                  Home Appliance Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition hover:text-teal-400"
                >
                  Electrical Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition hover:text-teal-400"
                >
                  Plumbing Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-teal-400" />
                ibrahimabdulla12651@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-teal-400" />
                +880 1300000000
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-teal-400" />
                Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FixMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
