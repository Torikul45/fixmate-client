"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "technician" | "admin";
  createdAt?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load users.");
      }

      setUsers(result.users);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    try {
      setUpdatingId(userId);

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update role.");
      }

      toast.success("User role updated successfully!");
      await fetchUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold text-teal-700">ADMIN PANEL</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Users
          </h1>
          <p className="mt-2 text-slate-500">
            View users and manage their platform roles.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500 sm:flex-1"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-187.5 text-left">
                <thead className="bg-slate-100 text-sm text-slate-600">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Manage Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}

                          <span className="font-semibold text-slate-800">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          disabled={updatingId === user._id}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value as User["role"],
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-teal-500 disabled:opacity-50"
                        >
                          <option value="customer">Customer</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>
    </main>
  );
}
