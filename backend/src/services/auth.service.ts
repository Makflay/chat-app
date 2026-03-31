import jwt from "jsonwebtoken";
import { Prisma } from "../generated/prisma";
import { prisma } from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash.password";
import { generateToken } from "../utils/jwt"; //, compareToken
import "../config/env";
import * as AuthTypes from "../types/auth.types";
import * as UserTypes from "../types/user.types";

export const registerUser = async (
  data: AuthTypes.IRegisterUser,
): Promise<{ user: UserTypes.IUser; token: string }> => {
  const exitingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (exitingUser) {
    throw new Error("User with this email already exist");
  }

  const hashedPassword = await hashPassword(data.password);
  const newUser: Prisma.UserCreateInput = {
    email: data.email,
    password: hashedPassword,
    name: data.name,
  };
  const user = await prisma.user.create({ data: newUser });
  const token = generateToken(user.id, user.role);

  return { user, token };
};

export const login = async (
  data: AuthTypes.ILoginUser,
): Promise<{ user: UserTypes.IUser; token: string }> => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new Error("User not found");
  }

  const isPassEquals = await comparePassword(data.password, user.password);
  if (!isPassEquals) {
    throw new Error("Wrong password");
  }

  const token = generateToken(user.id, user.role);

  return { user, token };
};

export const getCurrentsUser = async (
  userId: number,
): Promise<UserTypes.IUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
