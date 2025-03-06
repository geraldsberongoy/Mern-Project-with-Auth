import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  email: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        { email, password, name },
        { withCredentials: true },
      );
      console.log(response.data);
      set({
        isLoading: false,
        user: response.data.user,
        isAuthenticated: true,
        email: email,
      });
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
      console.log(error);
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/verify-email`,
        { code },
        { withCredentials: true },
      );
      console.log(response.data);
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
      console.log(error);
      throw error;
    }
  },

  resendEmailCode: async (email) => {
    set({ error: null });
    try {
      const response = await axios.post(
        `${API_URL}/resend-email-code`,
        { email },
        { withCredentials: true },
      );
      console.log(response.data);
      set({ user: response.data.user });
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
      console.log(error);
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true },
      );
      console.log(response.data);
      set({
        isLoading: false,
        user: response.data.user,
        isAuthenticated: true,
        email: email,
      });
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
      console.log(error);
      throw error;
    }
  },
}));
