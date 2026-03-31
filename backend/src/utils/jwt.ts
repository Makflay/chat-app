import jwt from "jsonwebtoken";
import "../config/env";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded as { userId: number; role: string };
};
