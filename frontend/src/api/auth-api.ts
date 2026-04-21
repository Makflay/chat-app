import apiClient from "./api-client";
import type {
  CurrentUserPayload,
  AuthPayload,
  LoginDto,
} from "../types/auth-api-types";

export const login = (dto: LoginDto): Promise<AuthPayload> => {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};

export const register = (dto: LoginDto): Promise<AuthPayload> => {
  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};

export const getCurrentUser = (): Promise<CurrentUserPayload> => {
  return apiClient("/auth/me", {
    method: "GET",
  });
};
