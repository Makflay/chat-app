import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.config";

const adapter = new PrismaPg(env.DATABASE_URL);

export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error", error);
    process.exit(1);
  }
};
