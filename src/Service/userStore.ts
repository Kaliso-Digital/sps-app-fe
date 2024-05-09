import create from "zustand";
import User from "../Interface/User";

interface UserStore {
  userData: User | null;
  setUserData: (data: User) => void;
}

const initialUserData = JSON.parse(localStorage.getItem('userData') || 'null');

export const useUserStore = create<UserStore>((set) => ({
  userData: initialUserData,
  setUserData: (data: User) => {
    // Save user data to localStorage
    localStorage.setItem('userData', JSON.stringify(data));
    set({ userData: data });
  },
}));