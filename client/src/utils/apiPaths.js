export const API_PATHS = {
  AUTH: {
    SESSION: "/api/auth/session",
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
  },
  PROFILE: {
    ME: "/api/users/me",
  },
  STORY: {
    LIST: "/api/stories",
    GET_ONE: (storyId) => `/api/stories/${storyId}`,
    CREATE: "/api/stories",
    UPDATE: (storyId) => `/api/stories/${storyId}`,
    REMOVE: (storyId) => `/api/stories/${storyId}`,
    MINE: "/api/stories/me",
  },
};
