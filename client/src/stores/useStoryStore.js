import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { API_PATHS } from "../utils/apiPaths.js";

const getErrorMessage = (error) => {
  if (error.response) return error.response.data?.message || "Request failed";
  if (error.request) return "Cannot reach the server. Please try again.";
  return "Something went wrong";
};

// Replace an updated story wherever it appears in a list.
const replaceIn = (list, story) =>
  list.map((s) => (s._id === story._id ? story : s));

export const useStoryStore = create((set, get) => ({
  // public feed
  stories: [],
  page: 0,
  total: 0,
  hasMore: false,
  listLoading: false,

  // single story
  story: null,
  storyLoading: false,

  // dashboard
  myStories: [],
  myStoriesLoading: false,

  createLoading: false,
  updateLoading: false,
  removeLoading: false,

  // page 1 replaces the list; later pages append (with duplicates removed)
  getStories: async ({ page = 1, limit = 12 } = {}) => {
    if (get().listLoading) {
      return { success: false, message: "Already loading" }; // blocks double clicks
    }
    set({ listLoading: true });
    try {
      const res = await axiosInstance.get(API_PATHS.STORY.LIST, {
        params: { page, limit },
      });
      const { stories: incoming, total } = res.data;

      const base = page === 1 ? [] : get().stories;
      const seen = new Set(base.map((s) => s._id));
      const merged = [...base, ...incoming.filter((s) => !seen.has(s._id))];

      set({ stories: merged, page, total, hasMore: merged.length < total });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ listLoading: false });
    }
  },

  getStory: async (storyId) => {
    set({ storyLoading: true, story: null }); // clear, so the previous story never flashes
    try {
      const res = await axiosInstance.get(API_PATHS.STORY.GET_ONE(storyId));
      set({ story: res.data.story });
      return { success: true, story: res.data.story };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ storyLoading: false });
    }
  },

  getMyStories: async () => {
    set({ myStoriesLoading: true });
    try {
      const res = await axiosInstance.get(API_PATHS.STORY.MINE);
      set({ myStories: res.data.stories });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ myStoriesLoading: false });
    }
  },

  // formData: title, content, optional contentImage file
  createStory: async (formData) => {
    set({ createLoading: true });
    try {
      const res = await axiosInstance.post(API_PATHS.STORY.CREATE, formData);
      const { story } = res.data;
      set((s) => ({ myStories: [story, ...s.myStories] }));
      return { success: true, story };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ createLoading: false });
    }
  },

  // formData can include title, content, status, contentImage, removeImage ("true")
  updateStory: async (storyId, formData) => {
    set({ updateLoading: true });
    try {
      const res = await axiosInstance.patch(
        API_PATHS.STORY.UPDATE(storyId),
        formData,
      );
      const { story } = res.data;
      set((s) => ({
        story: s.story?._id === story._id ? story : s.story,
        myStories: replaceIn(s.myStories, story),
        stories: replaceIn(s.stories, story),
      }));
      return { success: true, story };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ updateLoading: false });
    }
  },

  removeStory: async (storyId) => {
    set({ removeLoading: true });
    try {
      await axiosInstance.delete(API_PATHS.STORY.REMOVE(storyId));
      set((s) => ({
        myStories: s.myStories.filter((x) => x._id !== storyId),
        stories: s.stories.filter((x) => x._id !== storyId),
        total: Math.max(0, s.total - 1),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      set({ removeLoading: false });
    }
  },
}));
