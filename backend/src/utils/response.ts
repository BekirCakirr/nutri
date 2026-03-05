import { Response } from "express";

interface ApiSuccessOptions<T> {
  res: Response;
  data: T;
  message?: string;
  statusCode?: number;
  meta?: Record<string, unknown>;
}

interface ApiErrorOptions {
  res: Response;
  message: string;
  statusCode?: number;
  errors?: Array<{ code: string; message: string; field?: string }>;
}

export function sendSuccess<T>({
  res,
  data,
  message,
  statusCode = 200,
  meta,
}: ApiSuccessOptions<T>) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    meta,
    timestamp: new Date().toISOString(),
  });
}

export function sendError({
  res,
  message,
  statusCode = 400,
  errors,
}: ApiErrorOptions) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
}
