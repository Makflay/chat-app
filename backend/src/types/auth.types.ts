import { Role } from "../generated/prisma";
import type { User } from "./user.types";

export interface CurrentUserPayload {
  user: User;
}
export interface AuthPayload extends CurrentUserPayload {
  token: string;
}

export interface RegisterUser {
  email: string;
  username: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  role: Role;
  sessionId: string;
}
