import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";
import { errorResponse } from "../../utils/api.response";
import { prisma } from "../../config/db";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    errorResponse(res, "Not autorized", 401);
    return;
  }

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { activeSessionId: true, isKicked: true },
    });

    if (!user || user.isKicked || user.activeSessionId !== decoded.sessionId) {
      errorResponse(res, "Session expired", 401);
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 401);
      return;
    }
    errorResponse(res, "Unknown error");
    return;
  }
};

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.role !== "ADMIN") {
    errorResponse(res, "Admin access required", 403);
    return;
  }
  next();
};
