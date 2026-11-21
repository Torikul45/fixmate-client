
"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AddServicePage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "",
    serviceArea: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a service image.");
      return;
    }

    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      if (!apiKey) {
        throw new Error("ImgBB API key is missing.");
      }

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Please login again.");
        return;
      }

      // Upload image to ImgBB
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const imageResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const imageResult = await imageResponse.json();

      if (!imageResponse.ok || !imageResult.success) {
        throw new Error(
          imageResult.error?.message || "Image upload failed."
        );
      }

      const imageUrl = imageResult.data.display_url;

      // Save service with ImgBB image URL
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            ...formData,
            basePrice: Number(formData.basePrice),
            image: imageUrl,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add service.");
      }

      toast.success(
        "Service submitted successfully! Waiting for admin approval."
      );

      setFormData({
        title: "",
        category: "",
        description: "",
        basePrice: "",
        estimatedDuration: "",
        serviceMode: "",
        serviceArea: "",
      });

      setImage(null);
      setPreview("");

      const fileInput = document.getElementById(
        "service-image"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Add a New Service
        </h1>
        <p className="mt-2 text-slate-600">
          Provide repair service details for customers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Service Image Upload */}
        <div>
          <label className={labelClass}>
            Service Image <span className="text-red-500">*</span>
          </label>

          {preview ? (
            <div className="relative h-64 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200">
              <Image
                src={preview}
                alt="Service preview"
                fill
                unoptimized
                className="object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-700"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="service-image"
              className="flex min-h-52 max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-teal-600 hover:bg-teal-50"
            >
              <div className="rounded-full bg-teal-100 p-4 text-teal-700">
                <ImagePlus size={30} />
              </div>

              <p className="mt-4 font-bold text-slate-800">
                Click to upload service image
              </p>

              <p className="mt-2 text-sm text-slate-500">
                PNG, JPG or WEBP (Maximum 5MB)
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">
                <UploadCloud size={17} />
                Choose Image
              </span>
            </label>
          )}

          <input
            id="service-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Service Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>Service Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Smartphone Screen Repair"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select Category</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop & PC">Laptop & PC</option>
              <option value="AC">AC</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="TV">TV</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Starting Price ($)</label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              placeholder="e.g. 50"
              min="1"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Estimated Duration</label>
            <input
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              placeholder="e.g. 1-2 hours"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Service Mode</label>
            <select
              name="serviceMode"
              value={formData.serviceMode}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select Service Mode</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Service Area</label>
            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              placeholder="e.g. Dhaka"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Service Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the repair service..."
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-7 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Uploading & Submitting..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}
