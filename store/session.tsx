import { User } from "@/types/user";
import { create } from "zustand";

type SessionStore = {
  data: User;
  handleSession: (data: User) => void;
  edit: boolean;
  toggleEdit: () => void;
};

const useSessionStore = create<SessionStore>((set) => ({
  data: {
    id: "",
    name: "",
    surnames: "",
    password: "",
    businessName: "",
    profileImage: "",
    coverImage: "",
    birthday: "",
    email: "",
    isCompany: false,
    phone: "",
    address: "",
    accountType: "FREE",
    preferredContactMethod: "EMAIL",
    points: 0,
    county: { id: 0, county: "" },
    region: { id: 0, region: "" },
    country: { id: 0, country: "" },
    city: { id: 0, city: "" },
    createdAt: "",
    updatedAt: "",
    userCategory: {
      id: 0,
      name: "",
      level: 0,
      categoryDiscountAmount: 0,
      pointsThreshold: 0,
    },
  },
  handleSession: (data: User) => set(() => ({ data })),
  edit: false,
  toggleEdit: () => set((state) => ({ edit: !state.edit })),
}));

export default useSessionStore;
