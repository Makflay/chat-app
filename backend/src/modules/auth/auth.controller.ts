import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import * as AuthTypes from "../../types/auth.types";
import { successResponse, errorResponse } from "../../utils/api.response";

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return errorResponse(res, "Email, name and password are required", 400);
    }
    const { user, token } = await AuthService.registerUser({
      email,
      name,
      password,
    });
    const data: AuthTypes.IAuthResponseData = {
      id: user.id,
      name: user.name,
      role: user.role,
      token: token,
    };
    return successResponse(res, data, 201, "User created");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, "Unknown error", 400);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const { user, token } = await AuthService.login({ email, password });
    const data = {
      id: user.id,
      name: user.name,
      role: user.role,
      token: token,
    };
    return successResponse(res, data);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, "unknown error", 400);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user!.id;
    const user = await AuthService.getCurrentsUser(userId);
    return successResponse(res, user);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, "Uknown error", 400);
  }
};
