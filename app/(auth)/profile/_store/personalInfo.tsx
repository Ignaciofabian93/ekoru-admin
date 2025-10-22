import { PersonProfile, BusinessProfile } from "@/types/user";
import { create } from "zustand";

type PersonalInfoStore = {
  profile: PersonProfile | StoreProfile | ServiceProfile | null;
  setProfile: (profile: PersonProfile | StoreProfile | ServiceProfile) => void;
  isOpen: boolean;
  openModal: () => void;
  onClose: () => void;
};

const usePersonalInfoStore = create<PersonalInfoStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePersonalInfoStore;
