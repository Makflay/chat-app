import { prisma } from "../../../config/db";
import type { User } from "../../../types/user.types";

const userSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  isBot: true,
  isMuted: true,
};

export const muteUser = async (userId: number): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { isMuted: true },
    select: userSelect,
  });
};

export const unmuteUser = async (userId: number): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { isMuted: false },
    select: userSelect,
  });
};
