import { Prisma } from "../generated/prisma";
import { prisma } from "./db";
import { hashPassword } from "../utils/hash.password";
import "./env";

export const seedAdmin = async () => {
  try {
    const adminName = process.env.ADMIN_NAME!;
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;

    if (!adminName || !adminEmail || !adminPassword) {
      console.error("Admin credentials are not set in .env");
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
      name: adminName,
      role: "ADMIN",
    };
    await prisma.user.create({ data: newAdmin });
    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};
