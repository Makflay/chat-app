import apiClient from "./api-client";
import type { LoginDto, AuthResponse } from "../types/auth-api-types";

export const login = (dto: LoginDto): Promise<AuthResponse> => {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};

export const register = (dto: LoginDto): Promise<AuthResponse> => {
  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};

export const getCurrentUser = (): Promise<AuthResponse> => {
  return apiClient("/auth/me", {
    method: "GET",
  });
};
