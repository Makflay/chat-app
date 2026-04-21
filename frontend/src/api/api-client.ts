import type { FetchOptions, ApiResponse } from "../types/api-client-types";
import { useAuthStore } from "../store/auth-store";
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = async <T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> => {
  const token = useAuthStore.getState().token;
  console.log("token api-client", token);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let fullUrl = API_URL + url;
  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    fullUrl += `?${query}`;
  }

  const response = await fetch(fullUrl, { ...options, headers });

  let result: ApiResponse<T>;

  try {
    result = await response.json();
  } catch {
    throw new Error("Incorrect server response");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unknown API error");
  }

  console.log("result", result);
  console.log("result.data", result.data);

  return result.data;
};

export default apiClient;
