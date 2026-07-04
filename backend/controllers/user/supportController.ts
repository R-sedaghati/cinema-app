import { Request, Response } from "express";
import { categoryRepository, supportRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { Category } from "../../entities/Category.js";
import { paginate } from "../../utils/pagination.js";
import { User } from "../../entities/User.js";
import { CustomRequest } from "../../types/controllers.types.js";

export const supportCreateController = async (req: Request, res: Response) => {
  const { first_name, last_name, email, category_id, subject, message, phone_number } = req.body;

  let category: Category | null = null;
  if (category_id) {
    category = await categoryRepository().findOneBy({ id: category_id });
    if (!category) {
      return apiResponse(res, {
        statusCode: 404,
        success: false,
        message: "Category not found",
      });
    }
  }

  const support = supportRepository().create({
    firstName: first_name,
    lastName: last_name,
    email,
    subject,
    message,
    phoneNumber: phone_number,
    category: category ?? undefined,
  });

  await supportRepository().save(support);

  return apiResponse(res, {
    statusCode: 201,
    success: true,
    message: "Support ticket created successfully",
    data: support,
  });
};

export const getUserSupportListController = async (req: CustomRequest<{ user: User }>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        const { data, meta } = await paginate({
            repository: supportRepository(),
            req,
            options: {
                where: {
                    phoneNumber: String(req.payload?.user.phone_number)
                }
            }
        })
        return apiResponse(
            res, 
            {
                data,
                pagination: meta,
                req
            },
        )
    }
    const data = await supportRepository().findOne({
        where: { id: Number(id), phoneNumber: String(req.payload?.user.phone_number) }
    })
    return apiResponse(res, {
        data: data
    })
}