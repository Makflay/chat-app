import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const envShema = z.object({
  PORT: z.coerce.number().int().positive(),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().min(1, "JWT_EXPIRES_IN is required"),

  ADMIN_EMAIL: z.email("ADMIN_EMAIL must be valid email"),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD is required"),
  ADMIN_NAME: z.string().min(1, "ADMIN_NAME is required"),

  BOT_EMAIL: z.email("BOT_EMAIL is reqired"),
  BOT_PASSWORD: z.string().min(1, "BOT_PASSWORD is required"),
  BOT_NAME: z.string().min(1, "BOT_NAME is required"),

  YANDEX_KEY_ID: z.string().min(1, "YANDEX_KEY_ID is required"),
  YANDEX_API_KEY: z.string().min(1, "YANDEX_API_KEY is required"),
  YANDEX_MODEL_URI: z.string().min(1, "YANDEX_MODEL_URI is required"),
  AI_PROVAIDER: z.string().min(1, "AI_PROVAIDER is required"),

  GOOGLE_AUTH_URL: z.string().min(1, "GOOGLE_AUTH_URL is required"),
  GOOGLE_TOKEN_URL: z.string().min(1, "GOOGLE_TOKEN_URL is required"),
  GOOGLE_USERINFO_URL: z.string().min(1, "GOOGLE_USERINFO_URL is required"),

  SYSTEM_GROUP_KEY: z.string().min(1, "SYSTEM_GROUP_KEY is required"),

  VITE_API_URL: z.string().url("VITE_API_URL must be valid URL"),
  VITE_SOCKET_URL: z.string().url("VITE_SOCKET_URL must be valid URL"),
});

const parseEnv = envShema.safeParse(process.env);

if (!parseEnv.success) {
  console.error("Invalid environment variables");

  parseEnv.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  });

  throw new Error("Invalid environment variables");
}

export const env = parseEnv.data;
