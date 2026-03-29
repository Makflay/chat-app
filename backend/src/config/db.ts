import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "../config/env";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "",
  user: process.env.DATABASE_USER || "",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error", error);
    process.exit(1);
  }
};
