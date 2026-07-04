import { Request, Response } from "express";

interface PaginationInput {
  page: number;
  limit: number;
  total: number;
}

interface PaginationMeta {
  count: number;
  next: string | null;
  previous: string | null;
}

interface ApiResponseOptions<T> {
  success?: boolean;
  data?: T | null;
  message?: string;
  errors?: unknown;
  statusCode?: number;
  req?: Request;
  pagination?: PaginationInput;
}

const buildPageUrl = (req: Request, page: number): string => {
  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  url.searchParams.set("page", String(page));
  return url.toString();
};

export const apiResponse = <T>(
  res: Response,
  options: ApiResponseOptions<T>
) => {
  const {
    data = null,
    message = null,
    errors = null,
    statusCode = 200,
    req,
    pagination,
  } = options;

  let meta: PaginationMeta | undefined;

  if (pagination) {
    const { page, limit, total } = pagination;
    const totalPages = Math.ceil(total / limit);

    meta = {
      count: total,
      next: req && page < totalPages ? buildPageUrl(req, page + 1) : null,
      previous: req && page > 1 ? buildPageUrl(req, page - 1) : null,
    };
  }

  const body: Record<string, unknown> = { message };

  if (data !== null) body.result = data;
  if (errors !== null) body.errors = errors;
  if (message !== null) body.message = message;

  if (meta) {
    body.count = meta.count;
    body.next = meta.next;
    body.previous = meta.previous;
  }

  return res.status(statusCode).json(body);
};