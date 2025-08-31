"use client";
import { create } from "zustand";
import type { Role } from "./roles";

type Session = { user?: { id: string; name?: string; role: Role } } | null;

type AuthState = {
  session: Session;
  loginAs: (role: Role) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  session: null,
  loginAs: (role) =>
    set({
      session: {
        user: {
          id: "u1",
          name: role === "ADMIN" ? "Alex Admin" : "Mary Member",
          role,
        },
      },
    }),
  logout: () => set({ session: null }),
}));
