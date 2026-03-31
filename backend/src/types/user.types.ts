import { Role } from "../generated/prisma";

export interface IUser {
  id: number;
  name: string;
  role: Role;
  // email: string;
  // password: string;
}
