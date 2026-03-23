"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2 } from "lucide-react";
import { userSchema, type UserFormValues } from "@/lib/validations";
import { usersApi } from "@/lib/api";
import type { User } from "@/lib/types";

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500";

export function UserModal({ user, onClose }: UserModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", addresses: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        age: user.age,
        sex: user.sex,
        phone: user.phone ?? "",
        addresses: user.addresses.map((a) => ({
          street: a.street,
          city: a.city,
          state: a.state ?? "",
          zip_code: a.zip_code ?? "",
          country: a.country,
        })),
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: UserFormValues) => {
      const payload = {
        ...data,
        phone: data.phone || null,
        addresses: data.addresses.map((a) => ({
          ...a,
          state: a.state || null,
          zip_code: a.zip_code || null,
        })),
      };
      return isEdit
        ? usersApi.update(user!.id, payload)
        : usersApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className="max-h-[68vh] space-y-5 overflow-y-auto px-6 py-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                className={inputClass}
                placeholder="Full name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Age & Sex */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("age", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  max={150}
                  className={inputClass}
                  placeholder="e.g. 28"
                />
                {errors.age && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.age.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Sex <span className="text-red-500">*</span>
                </label>
                <select {...register("sex")} className={inputClass}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.sex && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.sex.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                {...register("phone")}
                className={inputClass}
                placeholder="e.g. +1 234 567 8900"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Addresses */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Addresses
                </label>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      street: "",
                      city: "",
                      state: "",
                      zip_code: "",
                      country: "",
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Address
                </button>
              </div>

              {fields.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-200 py-6 text-center">
                  <p className="text-sm text-gray-400">No addresses added</p>
                </div>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Address {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <input
                          {...register(`addresses.${index}.street`)}
                          placeholder="Street *"
                          className={inputClass}
                        />
                        {errors.addresses?.[index]?.street && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.addresses[index].street?.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            {...register(`addresses.${index}.city`)}
                            placeholder="City *"
                            className={inputClass}
                          />
                          {errors.addresses?.[index]?.city && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.addresses[index].city?.message}
                            </p>
                          )}
                        </div>
                        <input
                          {...register(`addresses.${index}.state`)}
                          placeholder="State / Province"
                          className={inputClass}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          {...register(`addresses.${index}.zip_code`)}
                          placeholder="ZIP / Postal code"
                          className={inputClass}
                        />
                        <div>
                          <input
                            {...register(`addresses.${index}.country`)}
                            placeholder="Country *"
                            className={inputClass}
                          />
                          {errors.addresses?.[index]?.country && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.addresses[index].country?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                Something went wrong. Please try again.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {mutation.isPending ? "Saving..." : isEdit ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
