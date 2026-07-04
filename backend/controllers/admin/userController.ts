import { Request, Response } from "express";
import { userRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { SearchAndFilterService } from "../../services/searchAndFilter.js";
import { User } from "../../entities/User.js";

export const userListController = async(req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.count) || 5));

  const qb = userRepository().createQueryBuilder('user')
    .leftJoinAndSelect('user.artistRequests', 'artistRequests')
    .leftJoinAndSelect('artistRequests.categories', 'categories')
    .leftJoinAndSelect('artistRequests.portfolios', 'portfolios');

  const queryBuilder = new SearchAndFilterService<User>(
    qb,
    {
      filterable: {
        categoryId: 'categories.id',
        categoryName: 'categories.faName',
        createdAt: 'artistRequests.createdAt',
        updatedAt: 'artistRequests.updatedAt',
        status: 'artistRequests.status',
        city: 'user.city',
        skinColor: 'user.skinColor',
        height: 'user.height',
        weight: 'user.weight',
        dialect: 'user.dialect'
      },
      searchable: [
        "CONCAT(user.firstName, ' ', user.lastName)",
        'user.phone_number',
        'artistRequests.trackingCode'
      ],
      sortable: {
        category: 'categories.faName',
      },
    },
  );

  const appliedQb = queryBuilder.apply(req.query);

  appliedQb
    .skip((page - 1) * limit)
    .take(limit);

  const [data, total] = await appliedQb.getManyAndCount();

  return apiResponse(res, {
    data,
    req,
    pagination: {
      page,
      limit,
      total,
    },
  });
}