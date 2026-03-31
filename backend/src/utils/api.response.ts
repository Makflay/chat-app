import { Response } from "express";
import { ApiSuccessResponse, ApiErrorResponse } from "../types/response.types";

export const successResponse = <T>(
  res: Response,
  data: T,
  status = 200,
  message?: string,
): Response<ApiSuccessResponse<T>> => {
  return res.status(status).json({ success: true, data, message });
};

export const errorResponse = (
  res: Response,
  message: string,
  status = 500,
): Response<ApiErrorResponse> => {
  return res.status(status).json({
    success: false,
    data: null,
    message,
  });
};
