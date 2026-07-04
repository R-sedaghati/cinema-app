import { Request, Response } from "express";
import { categoryRepository } from "../../models/index.js";
import { paginate } from "../../utils/pagination.js";
import { IsNull } from "typeorm";
import { apiResponse } from "../../utils/customResponse.js";
import { SearchAndFilterService } from "../../services/searchAndFilter.js";
import { ArtistRequest } from "../../entities/ArtistRequest.js";
import { Category } from "../../entities/Category.js";

export const categoryController = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.count) || 10));

  const query = categoryRepository()
    .createQueryBuilder("category")
    .loadRelationCountAndMap(
      "category.artistRequestsCount",
      "category.artistRequests"
    )
    .loadRelationIdAndMap("category.parent", "category.parent")
    .orderBy(
      "CASE WHEN category.parent_id IS NULL THEN 0 ELSE 1 END",
      "ASC"
    )
    .addOrderBy("category.priority", "ASC")
    .addOrderBy("category.id", "ASC")
    .skip((page - 1) * limit)
    .take(limit);

  const queryBuilder = new SearchAndFilterService<Category>(
    query,
    {
      filterable: {
        isActive: 'category.isActive'
      },
      searchable: [
        'category.faName'
      ],
      sortable: {}
    }
  )

  const [categories, total]: [Category[], number] = await queryBuilder.apply(req.query).getManyAndCount();

  return apiResponse(res, {
    data: categories,
    pagination: {
      page,
      limit,
      total,
    },
    req
  });
};

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { faName, enName, parentId, isActive, config, priority } = req.body;

    const category = await categoryRepository().findOne({
      where: { id: Number(id) },
      relations: {
        parent: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (faName !== undefined) {
      category.faName = faName;
    }

    if (enName !== undefined) {
      category.enName = enName;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    if (config !== undefined) {
      category.config = config
    }

    if (parentId !== undefined) {
      if (parentId === null) {
        category.parent = null;
      } else {
        const parent = await categoryRepository().findOne({
          where: { id: Number(parentId) },
        });

        if (!parent) {
          return res.status(404).json({
            message: "Parent category not found",
          });
        }

        category.parent = parent;
      }
    }

    if (priority !== undefined) {
      if (category.parent === null) {
        const oldPriority = category.priority ?? 1;

        if (priority !== oldPriority) {
          if (priority < oldPriority) {
            // Moving up
            await categoryRepository()
              .createQueryBuilder()
              .update(Category)
              .set({
                priority: () => `"priority" + 1`,
              })
              .where("parent_id IS NULL")
              .andWhere("id != :id", { id: category.id })
              .andWhere("priority >= :newPriority", {
                newPriority: priority,
              })
              .andWhere("priority < :oldPriority", {
                oldPriority,
              })
              .execute();
          } else {
            // Moving down
            await categoryRepository()
              .createQueryBuilder()
              .update(Category)
              .set({
                priority: () => `"priority" - 1`,
              })
              .where("parent_id IS NULL")
              .andWhere("id != :id", { id: category.id })
              .andWhere("priority <= :newPriority", {
                newPriority: priority,
              })
              .andWhere("priority > :oldPriority", {
                oldPriority,
              })
              .execute();
          }

          category.priority = priority;
        }
      }
    }

    if (category.parent === null) {
      const setConfig = config ?? category.config
      await categoryRepository()
      .createQueryBuilder('co_categories')
      .update(Category)
      .set({ config: setConfig })
      .where("parent_id = :id", { id: category.id })
      .execute()
    }

    const updatedCategory = await categoryRepository().save(category);

    return res.status(200).json({
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update category",
    });
  }
};


export const categoryRetrieveController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await categoryRepository()
    .createQueryBuilder("category")
    .loadRelationCountAndMap(
      "category.artistRequestsCount",
      "category.artistRequests"
    )
    .loadRelationIdAndMap("category.parent", "category.parent")
    .where("category.id = :id", { id })
    .getOne();

  if (!category) {
    return apiResponse(res, {
      statusCode: 404,
      success: false,
      message: "Category not found",
    });
  }

  category.config = (Object.keys(category.config ?? {}).length === 0 ? null : category.config) as Record<string, any> | null;

  return apiResponse(res, {
    data: category,
  });
};