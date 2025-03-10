import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  email: null,
  message: null,

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
        isAuthenticated: false,
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
      set({
        isLoading: false,
        isAuthenticated: false,
        user: response.data.user,
      });
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
      console.log("login successful: ", response.data);
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

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        withCredentials: true,
      });
      console.log(response.data);

      if (response.data.user) {
        set({
          isCheckingAuth: false,
          user: response.data.user,
          isAuthenticated: true,
          email: response.data.user.email,
        });
      } else {
        set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      }
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      console.log(error);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true },
      );
      console.log(response.data);
      set({ isLoading: false, isAuthenticated: false, user: null });
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
      console.log(error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/forgot-password`,
        { email },
        { withCredentials: true },
      );
      console.log(response.data);
      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
      console.log(error);
      throw error;
    }
  },
}));
