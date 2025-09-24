import axios from "axios";

/**
 * API client configured for backend integration.
 * Uses relative path so the dev server can proxy or serve directly if hosted together.
 */
const apiBase =
  // Prefer explicit runtime env variable injected by CRA build (if provided)
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE_URL) ||
  // Fallback to same-origin "/api" which works with CRA proxy or when backend is mounted under the same host
  "/api";

const api = axios.create({
  baseURL: apiBase,
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
