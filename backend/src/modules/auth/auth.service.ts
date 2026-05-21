import { randomUUID } from "crypto";
import { Prisma } from "../../generated/prisma";
import { prisma } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/hash.password";
import { generateToken } from "../../utils/jwt";
import "../../config/env";
import { RegisterUser, LoginUser } from "../../types/auth.types";
import { User } from "../../types/user.types";
import { attachChatBotForUser } from "../chat/bot/bot.chat.service";
import { attachUserToGroupChat } from "../chat/chat.group.service";
import { getIO } from "../../sockets";

const SESSION_REPLACED_MESSAGE =
  "You were logged out because your account was signed in on another device";

const disconnectPreviousSession = (userId: number) => {
  try {
    const io = getIO();
    io.to(`user: ${userId}`).emit("auth:session:replaced", {
      message: SESSION_REPLACED_MESSAGE,
    });
    io.to(`user: ${userId}`).disconnectSockets(true);
  } catch {
    return;
  }
};

export const registerUser = async (
  data: RegisterUser,
): Promise<{ user: User; token: string }> => {
  const exitingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (exitingUser) {
    throw new Error("User with this email already exist");
  }

  const hashedPassword = await hashPassword(data.password);
  const sessionId = randomUUID();
  const newUser: Prisma.UserCreateInput = {
    email: data.email,
    password: hashedPassword,
    username: data.username,
    activeSessionId: sessionId,
  };
  const user = await prisma.user.create({
    data: newUser,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBot: true,
      isMuted: true,
      isKicked: true,
    },
  });
  await attachChatBotForUser(user.id);
  await attachUserToGroupChat(user.id);
  const token = generateToken(user.id, user.role, sessionId);

  return { user, token };
};

export const login = async (
  data: LoginUser,
): Promise<{ user: User; token: string }> => {
  const secretUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBot: true,
      isMuted: true,
      isKicked: true,
      password: true,
    },
  });
  if (!secretUser) {
    throw new Error("User not found");
  }

  if (secretUser.isBot) {
    throw new Error("Invalid credentials");
  }

  if (secretUser.isKicked) {
    throw new Error("User is kicked from chat");
  }

  const isPassEquals = await comparePassword(
    data.password,
    secretUser.password,
  );
  if (!isPassEquals) {
    throw new Error("Wrong password");
  }

  const sessionId = randomUUID();

  await prisma.user.update({
    where: { id: secretUser.id },
    data: { activeSessionID: sessionId },
  });

  disconnectPreviousSession(secretUser.id);

  const token = generateToken(secretUser.id, secretUser.role, sessionId);
  const user: User = {
    id: secretUser.id,
    username: secretUser.username,
    email: secretUser.email,
    role: secretUser.role,
    isBot: secretUser.isBot,
    isMuted: secretUser.isMuted,
    isKicked: secretUser.isKicked,
  };

  return { user, token };
};

export const getCurrentUser = async (userId: number): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBot: true,
      isMuted: true,
      isKicked: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isKicked) {
    throw new Error("User is kicked from chat");
  }

  return user;
};
