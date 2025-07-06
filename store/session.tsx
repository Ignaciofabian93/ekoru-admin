import { create } from "zustand";

export type Admin = {
  id: string;
  email: string;
  name: string;
};

type SessionStore = {
  admin: Admin | null;
  setAdmin: (admin: Admin | null) => void;
};

const useSessionStore = create<SessionStore>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
}));

export default useSessionStore;
