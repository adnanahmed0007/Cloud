import axios from "axios";

// The Express backend mounts every route under /auth/api (see routes/SignupRoute.js)
// and listens on PORT (default 9090). Override with a .env file if your backend
// runs somewhere else: VITE_API_URL=http://localhost:9090
export const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:9090";
export const API_BASE_URL = `${SERVER_URL}/auth/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (issued by /login and /signup) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cloudex_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize "session expired" handling so every page doesn't have to.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cloudex_token");
      localStorage.removeItem("cloudex_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
