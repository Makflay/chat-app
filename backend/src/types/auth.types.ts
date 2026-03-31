import { Role } from "../generated/prisma";

export interface IRegisterUser {
  email: string;
  name: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthResponseData {
  id: number;
  name: string;
  role: string;
  token: string;
}

export interface JwtPayload {
  id: number;
  role: Role;
}
