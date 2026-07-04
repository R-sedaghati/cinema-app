import { FindManyOptions, ObjectLiteral, Repository } from "typeorm";
import { Request } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  next: string | null;
  previous: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

interface PaginateParams<T extends ObjectLiteral> {
  repository: Repository<T>;
  options?: FindManyOptions<T>;
  req: Request;
}

export const buildPageUrl = (req: Request, page: number): string => {
  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  url.searchParams.set("page", String(page));
  return url.toString();
};

export const paginate = async <T extends ObjectLiteral>({
  repository,
  options = {},
  req,
}: PaginateParams<T>): Promise<PaginatedResult<T>> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.count) || 5));

  const [data, total] = await repository.findAndCount({
    ...options,
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      next: page < totalPages ? buildPageUrl(req, page + 1) : null,
      previous: page > 1 ? buildPageUrl(req, page - 1) : null,
    },
    data,
  };
};