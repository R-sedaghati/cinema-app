import { Request, Response } from "express";
import { IsNull } from "typeorm";
import { categoryRepository } from "../../models/index.js";
import { paginate } from "../../utils/pagination.js";
import { apiResponse } from "../../utils/customResponse.js";

export const categoryController = async (req: Request, res: Response) => {
  const { data, meta } = await paginate({
    repository: categoryRepository(),
    req,
    options: {
      where: { parent: IsNull() },
      relations: { children: true },
      order: { id: "DESC" }
    }
  });

  return apiResponse(res, {
    data,
    pagination: meta,
    req,
    success: true
  });
};
