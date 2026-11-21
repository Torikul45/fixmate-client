import Link from "next/link";
import { ArrowLeft, Home, Search, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-base-100 px-5 py-16">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
          <Wrench size={30} strokeWidth={1.8} />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-teal-600">
          Oops! Something went missing
        </p>

        <h1 className="text-[100px] font-black leading-none tracking-tight text-base-content sm:text-[150px]">
          404<span className="text-teal-600">.</span>
        </h1>

        <h2 className="mt-5 text-2xl font-bold text-base-content sm:text-3xl">
          This page needs a repair!
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-base-content/60 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Don&apos;t worry, let&apos;s get you back on the right track.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-700"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-300 px-7 py-3.5 text-sm font-semibold text-base-content transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-600 hover:text-teal-600"
          >
            <Search size={18} />
            Explore Services
          </Link>
        </div>

        <div className="mt-12 border-t border-base-300 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-base-content/50 transition-colors hover:text-teal-600"
          >
            <ArrowLeft size={15} />
            Return to FixMate
          </Link>
        </div>
      </div>
    </main>
  );
}
