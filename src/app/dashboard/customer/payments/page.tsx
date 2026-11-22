
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Payment = {
  _id: string;
  bookingId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  booking?: {
    serviceTitle?: string;
    category?: string;
  };
};

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchPayments = async () => {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please login to view payment history.");
        }

        const response = await fetch(
          `${API_URL}/payments/my-payments`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load payment history."
          );
        }

        if (!ignore) {
          setPayments(result.payments || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void fetchPayments();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Payment History
      </h1>

      <p className="mt-2 text-slate-500">
        View all your repair service payments.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Recent Transactions
        </h2>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading payment history...
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl">💳</div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No payments yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your completed payments will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-162.5 text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-slate-100 text-sm"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {payment.booking?.serviceTitle || "Repair Service"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 font-bold text-slate-900">
                      ${Number(payment.amount).toFixed(2)}
                    </td>

                    <td className="px-4 py-4 text-slate-500">
                      {payment.stripePaymentIntentId || "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
