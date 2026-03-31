import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  status = 200,
  message?: string,
): Response => {
  return res.status(status).json({ success: true, data, message });
};

export const errorResponse = (
  res: Response,
  message: string,
  status = 500,
): Response => {
  return res.status(status).json({
    success: false,
    data: null,
    message,
  });
};
