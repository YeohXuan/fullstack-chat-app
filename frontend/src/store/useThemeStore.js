import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useThemeStore = create((set) => ({
  theme: "dark",
  setTheme: async (data) => {
    try {
      const res = await axiosInstance.put("/theme", { theme: data });
      set({ theme: res.data.theme });
      toast.success("Updated theme successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  fetchTheme: async () => {
    try {
      const res = await axiosInstance.get("/theme");
      set({ theme: res.data.theme });
    } catch (error) {
      console.log("Error fetching theme", error);
    }
  },
}));
