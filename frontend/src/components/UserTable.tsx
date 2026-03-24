"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { User } from "@/lib/types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const thClass =
  "px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500";

const SEX_BADGE: Record<string, string> = {
  male: "bg-blue-100 text-blue-700",
  female: "bg-pink-100 text-pink-700",
  other: "bg-gray-100 text-gray-600",
};

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 rounded-full bg-gray-100 p-4">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900">No users yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first user.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className={`${thClass} text-left`}>
              Name
            </th>
            <th className={`${thClass} text-left`}>
              Age
            </th>
            <th className={`${thClass} text-left`}>
              Sex
            </th>
            <th className={`${thClass} text-left`}>
              Phone
            </th>
            <th className={`${thClass} text-left`}>
              Addresses
            </th>
            <th className={`${thClass} text-right`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr
              key={user.id}
              className="transition-colors hover:bg-gray-50/70"
            >
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-400">#{user.id}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.age}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${SEX_BADGE[user.sex]}`}
                >
                  {user.sex}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {user.phone ?? <span className="text-gray-400">—</span>}
              </td>
              <td className="px-6 py-4">
                {user.addresses.length === 0 ? (
                  <span className="text-sm text-gray-400">—</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {user.addresses.map((addr) => (
                      <span
                        key={addr.id}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        title={`${addr.street}, ${addr.city}${addr.state ? `, ${addr.state}` : ""} ${addr.zip_code ?? ""}, ${addr.country}`}
                      >
                        {addr.city}, {addr.country}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(user)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                    title="Edit user"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
