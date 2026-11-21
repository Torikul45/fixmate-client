
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Payment = {
  _id: string;
  bookingId: string;
  customerId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  createdAt: string;
};

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchTransactions = async () => {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please login as admin.");
        }

        const response = await fetch(`${API_URL}/admin/transactions`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load transactions."
          );
        }

        if (!ignore) {
          setPayments(result.payments || []);
          setTotalRevenue(result.totalRevenue || 0);
          setTotalTransactions(result.totalTransactions || 0);
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

    void fetchTransactions();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Transactions
        </h1>
        <p className="mt-2 text-slate-600">
          View all customer payments and total platform revenue.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-linear-to-br from-teal-600 to-teal-800 p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-teal-100">
            Total Revenue
          </p>
          <h2 className="mt-3 text-3xl font-extrabold">
            ${totalRevenue.toFixed(2)}
          </h2>
          <p className="mt-2 text-sm text-teal-100">
            Total successful payments
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Transactions
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
            {totalTransactions}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Completed payment records
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            Payment History
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor all customer transactions.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading transactions...
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-700">
              $
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No Transactions Yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Customer payment records will appear here after successful
              Stripe payments.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-187.5 text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment._id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {payment.stripePaymentIntentId || payment._id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {payment.bookingId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ${Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                        {payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
