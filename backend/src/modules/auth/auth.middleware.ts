import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";
import { errorResponse } from "../../utils/api.response";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("req.headers.authorization", req.headers.authorization);
  console.log("token", token);

  if (!token) {
    console.log("NO TOKEN BRANCH");
    errorResponse(res, "Not autorized", 401);
    return;
  }

  try {
    console.log("BEFORE VERIFY");
    const decoded = verifyToken(token);
    console.log("DECODED", decoded);
    req.user = decoded;
    console.log("BEFORE NEXT");
    next();
  } catch (error) {
    console.log("VERIFY ERROR", error);
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
