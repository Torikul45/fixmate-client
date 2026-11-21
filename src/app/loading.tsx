
import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-base-100 px-5">
      <div className="flex flex-col items-center text-center">

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
          <Wrench size={30} strokeWidth={1.8} />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-base-content">
          FixMate
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          Preparing your experience...
        </p>

        <div className="mt-7 flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-teal-600/20 border-t-teal-600" />
          <span className="text-sm font-medium text-teal-700">
            Loading
          </span>
        </div>

        <p className="mt-5 text-xs text-base-content/40">
          Please wait a moment
        </p>
      </div>
    </main>
  );
}
