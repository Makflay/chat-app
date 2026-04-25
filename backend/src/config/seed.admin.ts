import { Prisma, Role } from "../generated/prisma";
import { prisma } from "./db";
import { hashPassword } from "../utils/hash.password";
import "./env";
import { attachUserToGroupChat } from "../modules/chat/chat.group.service";
import { attachChatBotForUser } from "../modules/chat/bot/bot.chat.service";

export const seedAdmin = async (): Promise<void> => {
  try {
    const adminName = process.env.ADMIN_NAME!;
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;

    if (!adminName || !adminEmail || !adminPassword) {
      console.log("Admin credentials are not set in .env");
      return;
    }

    const exitingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (exitingAdmin) {
      console.log("Admin alredy exist");
      return;
    }

    const hashedPassword = await hashPassword(adminPassword);
    const newAdmin: Prisma.UserCreateInput = {
      email: adminEmail,
      password: hashedPassword,
      username: adminName,
      role: Role.ADMIN,
    };
    const admin = await prisma.user.create({ data: newAdmin });
    await attachChatBotForUser(admin.id);
    await attachUserToGroupChat(admin.id);
    console.log("Admin created successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Creating seed admin error: ${error}`);
    } else {
      throw new Error("Creating seed admin unknown error");
    }
  }
};
