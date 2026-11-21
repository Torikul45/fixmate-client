
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt?: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    let active = true;

    const fetchServices = async () => {
      setLoading(true);

      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/services?status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load services.");
        }

        if (active) {
          setServices(
            Array.isArray(result) ? result : result.services || []
          );
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchServices();

    return () => {
      active = false;
    };
  }, [status]);

  const updateApproval = async (
    serviceId: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    setUpdatingId(serviceId);

    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/services/${serviceId}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ approvalStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update service.");
      }

      toast.success(
        approvalStatus === "approved"
          ? "Service approved successfully!"
          : "Service rejected successfully!"
      );

      setServices((previous) =>
        status === "all"
          ? previous.map((service) =>
              service._id === serviceId
                ? { ...service, approvalStatus }
                : service
            )
          : previous.filter((service) => service._id !== serviceId)
      );

      setSelectedService(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const getStatusStyle = (value: string) => {
    if (value === "approved") return "bg-green-100 text-green-700";
    if (value === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Service Approval
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review technician services and manage approval requests.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {["pending", "approved", "rejected", "all"].map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${
              status === item
                ? "bg-lime-400 text-gray-900"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item === "all" ? "All Services" : item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No services found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            There are no services in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {services.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  width={600}
                  height={300}
                  unoptimized
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div
                  role="img"
                  aria-label={`${service.title} image unavailable`}
                  className="h-48 w-full bg-gray-100"
                />
              )}

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {service.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {service.category}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                      service.approvalStatus
                    )}`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                  <div>
                    <p className="text-gray-500">Base Price</p>
                    <p className="font-semibold text-gray-900">
                      ${Number(service.basePrice).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {service.estimatedDuration || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Service Mode</p>
                    <p className="font-semibold text-gray-900">
                      {service.serviceMode}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Service Area</p>
                    <p className="font-semibold text-gray-900">
                      {service.serviceArea}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm font-semibold text-gray-800">
                    Technician Information
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {service.technicianName || "Name not available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {service.technicianEmail}
                  </p>
                </div>

                {service.approvalStatus === "pending" && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() =>
                        updateApproval(service._id, "approved")
                      }
                      disabled={updatingId === service._id}
                      className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === service._id
                        ? "Updating..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() => setSelectedService(service)}
                      disabled={updatingId === service._id}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Reject Service?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to reject{" "}
              <span className="font-semibold text-gray-900">
                {selectedService.title}
              </span>
              ? This action will change its approval status to rejected.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                disabled={updatingId === selectedService._id}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  updateApproval(selectedService._id, "rejected")
                }
                disabled={updatingId === selectedService._id}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {updatingId === selectedService._id
                  ? "Rejecting..."
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
