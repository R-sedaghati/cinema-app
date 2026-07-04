import { QueryFailedError } from "typeorm";

export const normalizeError = (error: any) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors = null;

  if (error?.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors || null;
  }

  if (error instanceof QueryFailedError) {
    statusCode = 400;
    message = "Database error";

    if ((error as any).code === "23505") {
      message = "Duplicate entry";
    }
  }

  return {
    success: false,
    statusCode,
    message,
    errors,
  };
};
