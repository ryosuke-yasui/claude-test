"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { usersApi } from "@/lib/api";
import { UserTable } from "@/components/UserTable";
import { UserModal } from "@/components/UserModal";
import { DeleteDialog } from "@/components/DeleteDialog";
import type { User } from "@/lib/types";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                User Dashboard
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {isLoading
                  ? "Loading..."
                  : `${users.length} user${users.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading && (
            <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span className="text-sm">Loading users...</span>
            </div>
          )}

          {isError && (
            <div className="py-20 text-center">
              <p className="text-sm font-medium text-red-500">
                Failed to load users.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Make sure the backend is running on port 7002.
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={setUserToDelete}
            />
          )}
        </div>
      </main>

      {isModalOpen && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}

      {userToDelete && (
        <DeleteDialog
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
}
