import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    const isLoginRequest = response.config?.url?.includes("/auth/login");
    const message = response.data?.message?.toLowerCase();
    const isTokenInvalidMessage = [
      "token tidak valid",
      "token tidak ada",
      "token expired",
      "jwt expired",
    ].includes(message);

    if (!isLoginRequest && isTokenInvalidMessage) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return response;
  },
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (!isLoginRequest && error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;