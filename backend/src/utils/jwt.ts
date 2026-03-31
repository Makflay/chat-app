import jwt from "jsonwebtoken";
import "../config/env";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded !== "object" || !decoded) {
    throw new Error("Invalid token");
  }

  if (!("id" in decoded) || !("role" in decoded)) {
    throw new Error("Invalid token payload");
  }

  return { id: decoded.id, role: decoded.role };
};
