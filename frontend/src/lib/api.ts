import axios from "axios";
import type { User, UserInput } from "./types";

const api = axios.create({
  baseURL:
    (typeof window === "undefined"
      ? process.env.API_URL
      : process.env.NEXT_PUBLIC_API_URL) ?? "http://localhost:7002",
});

export const usersApi = {
  list: (): Promise<User[]> => api.get<User[]>("/users/").then((r) => r.data),
  get: (id: number): Promise<User> =>
    api.get<User>(`/users/${id}`).then((r) => r.data),
  create: (data: UserInput): Promise<User> =>
    api.post<User>("/users/", data).then((r) => r.data),
  update: (id: number, data: UserInput): Promise<User> =>
    api.put<User>(`/users/${id}`, data).then((r) => r.data),
  delete: (id: number): Promise<void> =>
    api.delete(`/users/${id}`).then(() => undefined),
};
