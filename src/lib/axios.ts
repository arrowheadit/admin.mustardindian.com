// src/lib/axios.ts
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

// Base URL for the API
const BASE_URL =
  import.meta.env.VITE_API_ENDPOINT ??
"http://api.restuarant.local/api/admin";

// Axios instance for guest users (no authentication)
export const guestAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Axios instance for authenticated users (with JWT)
export const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Automatically attach JWT from localStorage for authenticated requests
authAxios.interceptors.request.use(
  (config) => {
    const auth = Cookies.get("auth");
    if (!auth) throw new AxiosError("Unauthenticated: No access token found.", "401");
    const { token } = JSON.parse(auth);
    if (!token) {
      // Throwing an error if token is not available (unauthenticated)
      throw new AxiosError("Unauthenticated: No access token found.", "401");
    }
    config.headers.Authorization = `Bearer ${token}`;
    // x-csrf
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Automatically handle 401 (Unauthorized) responses
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access. Please log in.");
      // Optionally, you can redirect to the login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
