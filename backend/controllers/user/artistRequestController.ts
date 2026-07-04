import { Response, Request } from "express";
import { CustomRequest } from "../../types/controllers.types.js";
import { User } from "../../entities/User.js";
import {
  artistRequestRepository,
  artistPortfolioRepository,
} from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { ArtistRequest } from "../../entities/ArtistRequest.js";
import { artistRequestSerializer } from "../../serializers/artistRequestSerializer.js";
import { MinioService } from "../../services/minio.js";
import { SearchAndFilterService } from "../../services/searchAndFilter.js";
import { paginate } from "../../utils/pagination.js";
import { ArtistPortfolio } from "../../entities/ArtistPortfolio.js";
import { ArtistRequestStatus } from "../../utils/enum.js";

/**
 * Helper utility: sets entity field only if user's current field is null
 * and incoming value is not undefined
 */
function setIfNull<T, K extends keyof T>(entity: T, key: K, value: T[K] | undefined) {
  if (entity[key] === null && value !== undefined) {
    entity[key] = value;
  }
}

export const createArtistRequest = async (
  req: CustomRequest<{ user: User }>,
  res: Response
) => {
  const userId = req.payload?.user.id;

  try {
    const {
      categoryIds,
      firstName,
      lastName,
      height,
      weight,
      language,
      dialect,
      email,
      address,
      province,
      city,
      postalCode,
      education,
      major,
      avatar,
      portfolios,
      birthDate,
      gender,
      skinColor
    } = req.body;
    if (!categoryIds) {
      return apiResponse(res, {
        statusCode: 400,
        success: false,
        message: "Category IDs are required",
      })
    }

    const categories =
      Array.isArray(categoryIds) && categoryIds.length > 0
        ? categoryIds.map((id: number) => ({ id }))
        : [];

    const queryRunner =
      artistRequestRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: "pessimistic_write" },
      });

      if (!user) {
        throw new Error("User not found");
      }

      setIfNull(user, "firstName", firstName);
      setIfNull(user, "lastName", lastName);
      setIfNull(user, "height", height);
      setIfNull(user, "weight", weight);
      setIfNull(user, "language", language);
      setIfNull(user, "dialect", dialect);
      setIfNull(user, "email", email);
      setIfNull(user, "address", address);
      setIfNull(user, "province", province);
      setIfNull(user, "city", city);
      setIfNull(user, "postalCode", postalCode);
      setIfNull(user, "education", education);
      setIfNull(user, "major", major);
      setIfNull(user, "avatar", avatar);
      setIfNull(user, "birthDate", birthDate);
      setIfNull(user, "gender", gender);
      setIfNull(user, "skinColor", skinColor);

      await queryRunner.manager.save(User, user);

      const artistRequest = await queryRunner.manager.save(ArtistRequest, {
        user: { id: userId },
        categories,
      });

      const resPortfolios = [];

      if (Array.isArray(portfolios)) {
        for (const file of portfolios) {
          const portfolio = await queryRunner.manager.save(
            artistPortfolioRepository().create({
              filePath: file.path,
              type: file.type,
              artistRequest: { id: artistRequest.id },
            })
          );

          resPortfolios.push({
            id: portfolio.id,
            filePath: portfolio.filePath,
            type: portfolio.type,
          });
        }
      }

      await queryRunner.commitTransaction();

      return apiResponse(res, {
        statusCode: 201,
        success: true,
        message: "Artist request created successfully",
        data: {
          artistRequestId: artistRequest.id,
          status: artistRequest.status,
          portfolios: resPortfolios,
        },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error("Error creating artist request:", error);
    return apiResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to create artist request",
      errors: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


export const getArtistRequests = async (
  req: CustomRequest<{ user: User }>,
  res: Response,
) => {
  const userId = req.payload!.user.id;

  const { data: artistRequests, meta } = await paginate<ArtistRequest>({
    repository: artistRequestRepository(),
    req,
    options: {
      where: { user: { id: userId } },
      relations: ["user", "categories", "portfolios"],
    },
  });

  const avatarPaths = artistRequests
    .map(ar => ar.user.avatar)
    .filter((path): path is string => Boolean(path));

  const portfoliosPaths = artistRequests.flatMap(ar =>
    ar.portfolios
      ?.map(portfolio => portfolio.filePath)
      .filter(Boolean) ?? []
  );

  const avatarMap = await MinioService.getPublicUrls(avatarPaths);
  const portfoliosMap = await MinioService.getPublicUrls(portfoliosPaths);

  const serializedData = await artistRequestSerializer(artistRequests, avatarMap, portfoliosMap);

  return apiResponse(res, {
    statusCode: 200,
    success: true,
    data: serializedData,
    pagination: {...meta},
  });
};


export const getAllArtistsRequests = async (
  req: Request,
  res: Response,
) => {
  const qb = 
    artistRequestRepository()
      .createQueryBuilder('artists')
      .leftJoinAndSelect('artists.categories', 'categories')
      .distinct(true)
      .leftJoinAndSelect('artists.user', 'user')
      .leftJoinAndSelect('artists.portfolios', 'portfolios')
      .where("status=:status", {status: ArtistRequestStatus.APPROVED});
  const queryBuilder =
    new SearchAndFilterService<ArtistRequest>(
      qb,
      {
        filterable: {
          category: 'categories.id',
        },

        searchable: [
          'categories.faName',
        ],
        sortable: {
          category: 'categories.faName'
        }
      }
    );
  const [artistRequests, count]: [ArtistRequest[], number] = await queryBuilder.apply(req.query).getManyAndCount(); 
  const avatarPaths = artistRequests
    .map(ar => ar.user.avatar)
    .filter((path): path is string => Boolean(path));

  const avatarMap = await MinioService.getPublicUrls(avatarPaths);
  const portfoliosPaths = artistRequests.flatMap(ar =>
    ar.portfolios
      ?.map(portfolio => portfolio.filePath)
      .filter(Boolean) ?? []
  );
  const portfolioMap = await MinioService.getPublicUrls(portfoliosPaths)

  const serializedData = await artistRequestSerializer(
    artistRequests, 
    avatarMap, 
    portfolioMap,
    ['firstName', 'lastName', 'phoneNumber', 'email', 'address']
  );

  return apiResponse(res, {
    statusCode: 200,
    success: true,
    data: serializedData,
  });
};


export const getRetrieveArtistsRequests = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const artistRequest = await artistRequestRepository()
    .createQueryBuilder('artists')
    .leftJoinAndSelect('artists.categories', 'categories')
    .distinct(true)
    .leftJoinAndSelect('artists.user', 'user')
    .leftJoinAndSelect('artists.portfolios', 'portfolios')
    .where("artists.id = :id", { id })
    .getOne();

  if (!artistRequest) {
    return apiResponse(res, {
      statusCode: 404,
      success: false,
      message: "Artist request not found",
    });
  }

  const avatarPaths = [artistRequest.user.avatar].filter((path): path is string => Boolean(path));
  const avatarMap = await MinioService.getPublicUrls(avatarPaths);

  const portfoliosPaths = artistRequest.portfolios
    ?.map(portfolio => portfolio.filePath)
    .filter((path): path is string => Boolean(path)) ?? [];
  const portfolioMap = await MinioService.getPublicUrls(portfoliosPaths);

  const serializedData = await artistRequestSerializer(
    [artistRequest], 
    avatarMap, 
    portfolioMap,
    ['firstName', 'lastName', 'phoneNumber', 'email', 'address']
  );

  return apiResponse(res, {
    statusCode: 200,
    success: true,
    data: serializedData[0],
  });
};

export const updateArtistRequestController = async (
  req: CustomRequest<{ user: User }>,
  res: Response
) => {
  const userId = req.payload?.user.id;
  const { id } = req.params;

  try {
    const {
      categoryIds,
      firstName,
      lastName,
      height,
      weight,
      language,
      dialect,
      email,
      address,
      province,
      city,
      postalCode,
      education,
      major,
      avatar,
      portfolios,
      birthDate,
      gender,
      skinColor,
    } = req.body;

    const queryRunner =
      artistRequestRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const artistRequest = await queryRunner.manager.findOne(ArtistRequest, {
        where: { id: Number(id), user: { id: userId } },
        lock: { mode: "pessimistic_write" },
      });

      if (!artistRequest) {
        return apiResponse(res, {
          statusCode: 404,
          success: false,
          message: "Artist request not found",
        });
      }

      // update categories if provided
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        artistRequest.categories = categoryIds.map((catId: number) => ({ id: catId } as any));
      }

      await queryRunner.manager.save(ArtistRequest, artistRequest);

      // partial update user fields — only overwrite fields that are provided
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: "pessimistic_write" },
      });

      if (user) {
        const fields: Record<string, any> = {
          firstName, lastName, height, weight, language, dialect,
          email, address, province, city, postalCode, education,
          major, avatar, birthDate, gender, skinColor,
        };

        for (const [key, value] of Object.entries(fields)) {
          if (value !== undefined) {
            (user as any)[key] = value;
          }
        }

        await queryRunner.manager.save(User, user);
      }

      // portfolios: replace if provided, skip if not in body
      const resPortfolios = [];

      if (Array.isArray(portfolios)) {
        await queryRunner.manager.delete(ArtistPortfolio, {
          artistRequest: { id: artistRequest.id },
        });

        for (const file of portfolios) {
          const portfolio = await queryRunner.manager.save(
            artistPortfolioRepository().create({
              filePath: file.path,
              type: file.type,
              artistRequest: { id: artistRequest.id },
            })
          );

          resPortfolios.push({
            id: portfolio.id,
            filePath: portfolio.filePath,
            type: portfolio.type,
          });
        }
      }

      await queryRunner.commitTransaction();

      return apiResponse(res, {
        statusCode: 200,
        success: true,
        message: "Artist request updated successfully",
        data: {
          artistRequestId: artistRequest.id,
          status: artistRequest.status,
          portfolios: resPortfolios,
        },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error("Error updating artist request:", error);
    return apiResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to update artist request",
      errors: error instanceof Error ? error.message : "Unknown error",
    });
  }
};