
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Wrench,
  Smartphone,
  Laptop,
  Snowflake,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ShieldCheck,
  CreditCard,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Browse repair services and choose the right technician for your device.",
    href: "/services",
  },
  {
    number: "02",
    title: "Send a Request",
    description: "Submit your repair problem, address and preferred date.",
    href: "/services",
  },
  {
    number: "03",
    title: "Technician Fixes It",
    description: "A technician accepts your request and completes the repair.",
    href: "/sign-in",
  },
  {
    number: "04",
    title: "Pay After Completion",
    description: "Pay securely after your repair service is completed.",
    href: "/dashboard/customer/bookings",
  },
];

const categories = [
  { name: "Smartphone", icon: Smartphone },
  { name: "Laptop & PC", icon: Laptop },
  { name: "AC", icon: Snowflake },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "TV", icon: Tv },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Electrical", icon: Zap },
];

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  image: string;
  technicianName: string;
};

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services`,
        );

        if (!response.ok) {
          throw new Error("Failed to load services.");
        }

        const result: Service[] = await response.json();
        setFeaturedServices(result.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#071827] via-[#0b2638] to-[#064e59] text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[28px_28px] opacity-10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-sm font-medium text-teal-200">
              <CheckCircle2 size={16} />
              Trusted Home & Device Repair Platform
            </span>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Broken Device?
              <span className="mt-2 block bg-linear-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Get It Fixed by Verified Technicians.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              Find skilled technicians for your home appliances and smart
              devices. Request a repair and pay only after the job is completed.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-400"
              >
                Explore Services <ArrowRight size={18} />
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:border-teal-300 hover:bg-white/10"
              >
                Join FixMate
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal-400" />
                Verified Technicians
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal-400" />
                Secure Payments
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal-400" />
                Pay After Service
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-4xl border border-white/15 bg-white/6 p-8 shadow-2xl backdrop-blur-xl">
              <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-teal-400/20 blur-2xl" />
              <div className="absolute bottom-8 left-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />

              <div className="relative w-full text-center">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-3xl border border-teal-300/30 bg-linear-to-br from-teal-400/30 to-cyan-400/10 shadow-xl shadow-teal-500/10">
                  <Wrench
                    size={76}
                    strokeWidth={1.4}
                    className="text-teal-300"
                  />
                </div>

                <h2 className="mt-8 text-2xl font-bold">Repair Made Simple</h2>
                <p className="mt-3 text-slate-300">
                  Your trusted partner for everyday repairs.
                </p>

                <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-5 py-2 text-sm font-semibold text-teal-300">
                  <CheckCircle2 size={16} />
                  Fast · Reliable · Convenient
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-teal-600">
              Our Services
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured Repair Services
            </h2>
            <p className="mt-3 text-slate-500">
              Find the right repair service for your device.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-semibold text-teal-600 transition hover:text-teal-700"
          >
            View All Services <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="h-48 rounded-xl bg-slate-200" />
                <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="mt-10 rounded-xl bg-red-50 p-6 text-center text-red-600">
            {error}
          </p>
        ) : featuredServices.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden bg-slate-100">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={500}
                      height={300}
                      unoptimized
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-teal-600">
                      <Wrench size={48} />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    {service.category}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Technician: {service.technicianName}</p>
                    <p>Service Mode: {service.serviceMode}</p>
                    <p>Location: {service.serviceArea}</p>
                    <p>Duration: {service.estimatedDuration}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xl font-bold text-teal-700">
                      ${service.basePrice.toFixed(2)}
                    </p>

                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700"
                    >
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-teal-200 bg-white px-6 py-14 text-center shadow-sm">
            <Wrench size={32} className="mx-auto text-teal-600" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Services Coming Soon
            </h3>
            <p className="mt-2 text-slate-500">
              Approved repair services will appear here.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
            >
              Browse Services <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-widest text-teal-600">
              Simple Process
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              How FixMate Works
            </h2>
            <p className="mt-4 text-slate-500">
              Getting your device repaired is easier than ever.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Link
                key={step.number}
                href={step.href}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-teal-300 hover:bg-white hover:shadow-lg"
              >
                <span className="text-3xl font-extrabold text-teal-600/40">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-teal-600">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-600">
                  Learn More <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-teal-600">
            What We Repair
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Popular Categories
          </h2>
          <p className="mt-4 text-slate-500">
            Explore repair services across different categories.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white">
                  <Icon size={32} strokeWidth={1.7} />
                </div>
                <h3 className="mt-4 font-bold text-slate-900 transition group-hover:text-teal-600">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Explore services →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Choose FixMate */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#071827] via-[#0b2638] to-[#064e59] py-20 text-white">
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-widest text-teal-300">
              Why FixMate
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Repair Services You Can Trust
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              We make device and appliance repair convenient, transparent and
              reliable.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-teal-300/40 hover:bg-white/10">
              <ShieldCheck size={36} className="text-teal-300" />
              <h3 className="mt-5 text-xl font-bold">Verified Technicians</h3>
              <p className="mt-3 leading-7 text-slate-300">
                Find technicians whose services are reviewed and approved by
                admins.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-teal-300/40 hover:bg-white/10">
              <CreditCard size={36} className="text-teal-300" />
              <h3 className="mt-5 text-xl font-bold">Secure Payments</h3>
              <p className="mt-3 leading-7 text-slate-300">
                Complete your payment securely after the repair is finished.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-teal-300/40 hover:bg-white/10">
              <ClipboardList size={36} className="text-teal-300" />
              <h3 className="mt-5 text-xl font-bold">Track Your Repairs</h3>
              <p className="mt-3 leading-7 text-slate-300">
                Follow your repair request from submission to completion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
