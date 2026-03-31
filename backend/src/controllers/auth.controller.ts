import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import * as UserTypes from "../types/user.types";
import { successResponse, errorResponse } from "../utils/api.response";

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return errorResponse(res, "Email, name and password are required", 400);
    }
    const newUser = await AuthService.registerUser({
      email,
      name,
      password,
    });
    return successResponse(res, newUser, 201, "User created");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, "Unknown error", 400);
  }
};
