
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Users,
  Wrench,
  Target,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Technicians",
    description:
      "Connect with skilled technicians who provide reliable repair services.",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description:
      "Book repair services easily and get your device fixed without unnecessary delays.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "We focus on customer satisfaction through transparent and convenient service.",
  },
  {
    icon: Wrench,
    title: "Quality Repairs",
    description:
      "From smartphones to home appliances, we help you find the right repair solution.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-teal-50 via-white to-cyan-50 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <span className="rounded-full bg-teal-100 px-5 py-2 text-sm font-semibold text-teal-700">
            About FixMate
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">
            Your Trusted Partner for
            <span className="block text-teal-600">
              Smart Repair Solutions
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            FixMate makes device and home appliance repair simple,
            convenient, and reliable. Find skilled technicians and get
            the service you need in one place.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="rounded-xl bg-teal-600 px-7 py-3.5 font-semibold text-white transition hover:bg-teal-700"
            >
              Explore Services
              <ArrowRight className="ml-2 inline-block" size={18} />
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-600"
            >
              Join FixMate
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Making Repair Services Easier for Everyone
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              FixMate is a smart device and home appliance repair service
              platform designed to connect customers with professional
              technicians.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Whether you need smartphone repair, laptop support, AC
              servicing, refrigerator repair, or other appliance
              maintenance, FixMate helps you find the right service
              conveniently.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Easy service discovery and booking",
                "Transparent service pricing",
                "Professional technician connections",
                "Secure online payment after completion",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0 text-teal-600" size={21} />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-linear-to-br from-teal-500 to-cyan-600 p-8 sm:p-12">
              <div className="rounded-2xl bg-white p-8 shadow-xl sm:p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                  <Wrench size={34} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  Repair Made Simple
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  Find a service, send a request, let a technician handle
                  the repair, and pay after the job is completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <Target size={28} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              Our Mission
            </h3>

            <p className="mt-4 leading-8 text-slate-600">
              Our mission is to make repair services accessible and
              hassle-free by connecting customers with skilled technicians
              through a convenient and transparent platform.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
              <HeartHandshake size={28} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              Our Vision
            </h3>

            <p className="mt-4 leading-8 text-slate-600">
              Our vision is to become a trusted repair service platform
              where customers can easily find quality services and
              technicians can grow their professional opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
              Why Choose Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              What Makes FixMate Different?
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              We bring convenience, reliability, and transparency to
              everyday repair services.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-slate-900 px-7 py-14 text-center sm:px-14">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Need a Repair Service?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
            Explore available repair services and connect with a
            technician today.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center rounded-xl bg-teal-500 px-7 py-3.5 font-bold text-white transition hover:bg-teal-600"
          >
            Find a Service
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
