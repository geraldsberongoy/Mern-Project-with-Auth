import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        { email, password, name },
        { withCredentials: true },
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  },
}));
