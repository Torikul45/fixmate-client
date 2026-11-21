"use client";

import { useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
};

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();

  if (isPending) {
    return (
      <div className="py-20 text-center text-slate-500">Loading profile...</div>
    );
  }

  if (!session?.user) {
    return (
      <div className="py-20 text-center text-slate-500">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <ProfileForm
      key={`${session.user.id}-${session.user.name}-${session.user.image ?? ""}-${session.user.phone ?? ""}-${session.user.area ?? ""}-${session.user.bio ?? ""}`}
      user={session.user as ProfileUser}
      refetch={refetch}
    />
  );
}

function ProfileForm({
  user,
  refetch,
}: {
  user: ProfileUser;
  refetch: () => Promise<unknown>;
}) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    area: user.area || "",
    bio: user.bio || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.image || "");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
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
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = user.image || "";

      // Upload profile image to ImgBB
      if (imageFile) {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
          throw new Error("ImgBB API key is missing.");
        }

        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: uploadData,
          },
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error("Image upload failed.");
        }

        imageUrl = uploadResult.data.url;
      }

      // Update profile using Server API
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            image: imageUrl,
            phone: formData.phone.trim(),
            area: formData.area.trim(),
            bio: formData.bio.trim(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile.");
      }

      // Refresh session data
      await refetch();

      setImageFile(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Update Profile</h1>
        <p className="mt-2 text-slate-500">
          Manage your personal information and profile details.
        </p>
      </div>

      <div className="mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Profile Picture
            </label>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {preview ? (
                <Image
                  src={preview}
                  alt="Profile preview"
                  width={100}
                  height={100}
                  unoptimized
                  className="h-24 w-24 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-3xl font-bold text-teal-700">
                  {formData.name.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-teal-800"
                />

                <p className="mt-2 text-xs text-slate-400">
                  JPG, PNG or other image formats. Maximum size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
            />

            <p className="mt-1 text-xs text-slate-400">
              Email address cannot be changed here.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Area */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Area
            </label>

            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter your area"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Write something about yourself"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
