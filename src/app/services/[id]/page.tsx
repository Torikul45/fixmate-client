
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  User,
  CalendarDays,
  Phone,
  Mail,
  Send,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: string;
  isAvailable: boolean;
};

type BookingForm = {
  phone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
};

type SessionUser = {
  name?: string;
  email?: string;
  role?: string;
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [formData, setFormData] = useState<BookingForm>({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  // Fetch Service Details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services/${id}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Service not found");
        }

        const serviceData = data.service || data;

        if (
          serviceData.approvalStatus !== "approved" ||
          serviceData.isAvailable === false
        ) {
          setService(null);
          return;
        }

        setService(serviceData);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load service"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  // Today's date
  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Check Session and Customer Role
  const handleRequestService = async () => {
    try {
      setCheckingUser(true);

      const { data: sessionData, error } =
        await authClient.getSession();

      if (error) {
        console.error("Session Error:", error);
      }

      const user = sessionData?.user as SessionUser | undefined;

      if (!user) {
        router.push(
          `/sign-in?returnTo=${encodeURIComponent(`/services/${id}`)}`
        );
        return;
      }

      if (user.role !== "customer") {
        toast.error("Only customers can request repair services.");
        return;
      }

      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
      setFormOpen(true);

      toast.success("You can now submit your repair request.");
    } catch (error) {
      console.error("Booking Session Error:", error);
      toast.error("Unable to check your account. Please try again.");
    } finally {
      setCheckingUser(false);
    }
  };

  // Submit Booking
  const handleSubmitBooking = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (formData.problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters.");
      return;
    }

    if (!formData.phone.trim() || !formData.address.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!formData.preferredDate || formData.preferredDate < minDate) {
      toast.error("Please select today or a future date.");
      return;
    }

    try {
      setSubmitting(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Your session expired. Please sign in again.");

        router.push(
          `/sign-in?returnTo=${encodeURIComponent(`/services/${id}`)}`
        );
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            serviceId: id,
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            preferredDate: formData.preferredDate,
            problemDescription: formData.problemDescription.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit booking request."
        );
      }

      toast.success("Your repair request has been submitted!");

      router.push("/dashboard/customer/bookings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-teal-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Wrench size={48} className="mb-4 text-slate-400" />

        <h2 className="text-2xl font-bold text-slate-800">
          Service Not Found
        </h2>

        <p className="mt-2 text-slate-500">
          This service is unavailable or does not exist.
        </p>

        <Link
          href="/services"
          className="mt-6 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 font-medium text-slate-600 hover:text-teal-600"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        {/* Service Details */}
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div className="relative min-h-70 overflow-hidden rounded-2xl bg-slate-100">
            {service.image?.trim() ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-70 items-center justify-center">
                <Wrench size={56} className="text-slate-400" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
              {service.title}
            </h1>

            <p className="mt-5 leading-7 text-slate-600">
              {service.description}
            </p>

            <div className="mt-7 space-y-4 border-t border-slate-100 pt-6">
              <p className="flex items-center gap-3 text-slate-600">
                <Clock size={20} className="text-teal-600" />
                {service.estimatedDuration}
              </p>

              <p className="flex items-center gap-3 text-slate-600">
                <MapPin size={20} className="text-teal-600" />
                {service.serviceArea}
              </p>

              <p className="flex items-center gap-3 text-slate-600">
                <Wrench size={20} className="text-teal-600" />
                {service.serviceMode}
              </p>

              <p className="flex items-center gap-3 text-slate-600">
                <User size={20} className="text-teal-600" />
                {service.technicianName || "Name not available"}
              </p>

              <p className="flex items-center gap-3 text-slate-600">
                <Mail size={20} className="text-teal-600" />
                {service.technicianEmail || "Email not available"}
              </p>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-500">Starting Price</p>

              <p className="mt-1 text-3xl font-bold text-teal-700">
                ${service.basePrice}
              </p>

              <button
                type="button"
                onClick={handleRequestService}
                disabled={checkingUser}
                className="mt-6 w-full rounded-xl bg-teal-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingUser ? "Please wait..." : "Request This Service"}
              </button>
            </div>
          </div>
        </div>

        {/* Customer Booking Form */}
        {formOpen && (
          <section
            id="booking-form"
            className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10"
          >
            <div className="mb-8">
              <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                Repair Request
              </span>

              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Book This Service
              </h2>

              <p className="mt-2 text-slate-500">
                Provide your details to request this repair service.
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Your Name
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={customerEmail}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Phone size={16} />
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={16} />
                    Preferred Date
                  </label>

                  <input
                    type="date"
                    min={minDate}
                    value={formData.preferredDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredDate: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Address
                </label>

                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  required
                  rows={3}
                  placeholder="Enter your full address"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Describe Your Problem
                </label>

                <textarea
                  value={formData.problemDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problemDescription: e.target.value,
                    })
                  }
                  required
                  minLength={20}
                  rows={5}
                  placeholder="Describe the device or appliance problem in at least 20 characters..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Minimum 20 characters. Current:{" "}
                  {formData.problemDescription.trim().length}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-7 py-3.5 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={18} />
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  disabled={submitting}
                  className="rounded-xl border border-slate-300 px-7 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
