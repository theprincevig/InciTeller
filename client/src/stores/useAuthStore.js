import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { API_PATHS } from "../utils/apiPaths.js";

// Turns an axios error into one readable message for the UI.
const getErrorMessage = (error) => {
  if (error.response) return error.response.data?.message || "Request failed";
  if (error.request) return "Cannot reach the server. Please try again.";
  return "Something went wrong";
};

export const useAuthStore = create((set) => ({
  authUser: null,

  sessionLoading: true, // true until the first session check finishes
  signupLoading: false,
  loginLoading: false,
  updateProfileLoading: false,

  // Call once on app load. A 401 just means "not logged in".
  session: async () => {
    set({ sessionLoading: true });
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.SESSION);
      const { user } = res.data;

      set({ authUser: user });
    } catch {
      set({ authUser: null });
    } finally {
      set({ sessionLoading: false });
    }
  },

  signup: async ({ email, password }) => {
    set({ signupLoading: true });
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        email,
        password,
      });

      const { user } = res.data;
      set({ authUser: user }); // the server logs the user in on register

      return user;
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ signupLoading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loginLoading: true });
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { user } = res.data;
      set({ authUser: user });

      return user;
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ loginLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      set({ authUser: null });
    } catch {
      // the session may already have expired on the server
    } finally {
      set({ authUser: null }); // always clear the UI
    }
  },

  viewProfile: async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.PROFILE.ME);
      const { user } = res.data;

      if (res.data?.user) {
        set({ authUser: user });
        return user;
      } else {
        console.error("Failed to fetch own profile: ", res.data?.error);
        return null;
      }
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },

  // Pass a FormData with any of: name, avatar (file), removeAvatar ("true").
  updateProfile: async (formData) => {
    set({ updateProfileLoading: true });
    try {
      const res = await axiosInstance.patch(API_PATHS.PROFILE.ME, formData);
      const { user } = res.data;

      set({ authUser: user }); // refreshes the navbar name and avatar
      return user;
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ updateProfileLoading: false });
    }
  },
}));
