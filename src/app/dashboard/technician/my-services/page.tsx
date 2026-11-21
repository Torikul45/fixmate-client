
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Wrench,
  Clock,
  MapPin,
  X,
  ImagePlus,
} from "lucide-react";

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
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
};

type ServiceForm = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

const initialForm: ServiceForm = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editFormData, setEditFormData] = useState<ServiceForm>(initialForm);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/my-services`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load services");
      }

      setServices(result.services || result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadServices = async () => {
      await fetchServices();
    };

    loadServices();
  }, []);

  const handleAvailability = async (service: Service) => {
    setUpdatingId(service._id);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${service._id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            isAvailable: !service.isAvailable,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update availability");
      }

      toast.success("Availability updated!");
      await fetchServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);

    setEditFormData({
      title: service.title,
      category: service.category,
      description: service.description,
      basePrice: String(service.basePrice),
      estimatedDuration: service.estimatedDuration,
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
    });

    setEditImage(null);
    setImagePreview(service.image || "");
  };

  const closeEditModal = () => {
    if (savingEdit) return;

    setEditingService(null);
    setEditFormData(initialForm);
    setEditImage(null);
    setImagePreview("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setEditFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setEditImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingService) return;

    if (Number(editFormData.basePrice) <= 0) {
      toast.error("Please enter a valid service price.");
      return;
    }

    setSavingEdit(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Please login again.");
        return;
      }

      let imageUrl = editingService.image || "";

      if (editImage) {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
          throw new Error("ImgBB API key is missing.");
        }

        const imageData = new FormData();
        imageData.append("image", editImage);

        const imageResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: imageData,
          },
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok || !imageResult.success) {
          throw new Error("Image upload failed.");
        }

        imageUrl = imageResult.data.display_url;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${editingService._id}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            ...editFormData,
            basePrice: Number(editFormData.basePrice),
            image: imageUrl,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service.");
      }

      toast.success("Service updated! Waiting for admin approval.");

      setEditingService(null);
      setEditImage(null);
      setImagePreview("");
      setEditFormData(initialForm);

      await fetchServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingServiceId) return;

    setDeleting(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${deletingServiceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete service");
      }

      setServices((previous) =>
        previous.filter((service) => service._id !== deletingServiceId),
      );

      setDeletingServiceId(null);
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-teal-600" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Services</h1>
        <p className="mt-2 text-slate-600">
          Manage your repair services and availability.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Wrench className="mx-auto text-slate-400" size={42} />
          <h2 className="mt-4 text-xl font-bold text-slate-800">
            No Services Found
          </h2>
          <p className="mt-2 text-slate-500">
            You have not added any services yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-48 bg-slate-100">
                {service.image?.trim() ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Wrench size={42} />
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {service.title}
                  </h2>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      service.approvalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : service.approvalStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>

                <p className="text-sm text-slate-500">{service.category}</p>

                <p className="line-clamp-2 text-sm text-slate-600">
                  {service.description}
                </p>

                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Wrench size={16} /> {service.serviceMode}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {service.serviceArea}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> {service.estimatedDuration}
                  </p>
                </div>

                <p className="text-xl font-bold text-teal-700">
                  ${Number(service.basePrice).toFixed(2)}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span
                    className={`text-sm font-semibold ${
                      service.isAvailable ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {service.isAvailable ? "Available" : "Unavailable"}
                  </span>

                  <button
                    onClick={() => handleAvailability(service)}
                    disabled={updatingId === service._id}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                  >
                    {updatingId === service._id ? "Updating..." : "Toggle"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-50 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100"
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    onClick={() => setDeletingServiceId(service._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Edit Service
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your service information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={savingEdit}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Service Title
                </label>
                <input
                  required
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <input
                    required
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Base Price ($)
                  </label>
                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    name="basePrice"
                    value={editFormData.basePrice}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Estimated Duration
                  </label>
                  <input
                    required
                    name="estimatedDuration"
                    value={editFormData.estimatedDuration}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Service Mode
                  </label>
                  <select
                    required
                    name="serviceMode"
                    value={editFormData.serviceMode}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600"
                  >
                    <option value="">Select Mode</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Service Area
                  </label>
                  <input
                    required
                    name="serviceArea"
                    value={editFormData.serviceArea}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  required
                  minLength={20}
                  rows={4}
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Image (Optional)
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-4 transition hover:border-teal-500 hover:bg-teal-50">
                  <ImagePlus size={28} className="text-teal-600" />
                  <span className="mt-2 text-sm font-semibold text-slate-700">
                    Choose a new image
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WebP (Max 5 MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {imagePreview && (
                  <div className="relative mt-3 h-44 overflow-hidden rounded-xl border border-slate-200">
                    <Image
                      src={imagePreview}
                      alt="Service preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {editImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditImage(null);
                          setImagePreview(editingService.image || "");
                        }}
                        className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                After editing, your service will be sent to the admin for
                approval again.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="flex-1 rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingServiceId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={28} className="text-red-600" />
            </div>

            <h2 className="mt-4 text-center text-xl font-bold text-slate-900">
              Delete Service?
            </h2>

            <p className="mt-2 text-center text-sm text-slate-600">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingServiceId(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
