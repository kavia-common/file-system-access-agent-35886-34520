import axios from "axios";

/**
 * API client configured for backend integration.
 * Uses relative path so the dev server can proxy or serve directly if hosted together.
 */
const api = axios.create({
  baseURL: "/api",
  timeout: 20000,
});

// PUBLIC_INTERFACE
export function setApiBaseUrl(url) {
  /** Set the base URL for the API client at runtime. Useful when deploying behind a different path. */
  api.defaults.baseURL = url;
}

// Response interceptor for consistent error surfaces
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    // Normalize network/server errors
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Request failed";
    return Promise.reject({ ...error, message });
  }
);

export default api;
