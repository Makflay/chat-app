import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "../config/env";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

export const prisma = new PrismaClient({ adapter }); //{ adapter }

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error", error);
    process.exit(1);
  }
};
