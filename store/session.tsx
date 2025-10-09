import { create } from "zustand";
import type { Admin } from "../types/user";

type SessionStore = {
  data: Admin;
  handleSession: (data: Admin) => void;
  edit: boolean;
  toggleEdit: () => void;
};

const useSessionStore = create<SessionStore>((set) => ({
  data: {} as Admin,
  handleSession: (data: Admin) => set(() => ({ data })),
  edit: false,
  toggleEdit: () => set((state) => ({ edit: !state.edit })),
}));

export default useSessionStore;
