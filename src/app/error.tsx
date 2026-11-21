
"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-error" />

      <h2 className="text-2xl font-bold">
        Something went wrong!
      </h2>

      <p className="text-base-content/70">
        An unexpected error occurred. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="btn btn-primary"
      >
        Try Again
      </button>
    </div>
  );
}
