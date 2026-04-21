import { Role } from "../generated/prisma";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  isBot: boolean;
}
