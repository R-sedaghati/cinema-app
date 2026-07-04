import { Request, Response } from "express";
import { artistRequestRepository } from "../../models/index.js"
import { artistRequestSerializer, updateArtistRequestSerializer } from "../../serializers/artistRequestSerializer.js";
import { apiResponse } from "../../utils/customResponse.js";
import { paginate } from "../../utils/pagination.js";
import { MinioService } from "../../services/minio.js";
import { SearchAndFilterService } from "../../services/searchAndFilter.js";
import { ArtistRequest } from "../../entities/ArtistRequest.js";

export const artistsRequestsController = async (
  req: Request,
  res: Response,
) => {
  const rawPage = Number(req.query.page);
  const rawLimit = Number(req.query.count);
  const page = rawPage > 0 ? rawPage : 1;
  const limit = rawLimit > 0 ? Math.min(rawLimit, 100) : 20;

  const qb =
    artistRequestRepository()
      .createQueryBuilder('artists')
      .leftJoinAndSelect('artists.categories', 'categories')
      .distinct(true)
      .leftJoinAndSelect('artists.user', 'user')
      .leftJoinAndSelect('artists.portfolios', 'portfolios')
      .leftJoinAndSelect('artists.rejectedReasons', 'rejectedReasons')
      .addOrderBy('rejectedReasons.createdAt', 'DESC');

  const queryBuilder = new SearchAndFilterService<ArtistRequest>(
    qb,
    {
      filterable: {
        categoryId: 'categories.id',
        categoryName: 'categories.faName',
        createdAt: 'artists.createdAt',
        updatedAt: 'artists.updatedAt',
        status: 'artists.status',
        city: 'user.city',
        skinColor: 'user.skinColor',
        height: 'user.height',
        weight: 'user.weight',
        dialect: 'user.dialect'
      },
      searchable: [
        "CONCAT(user.firstName, ' ', user.lastName)",
        'user.phone_number',
      ],
      sortable: {
        category: 'categories.faName',
      },
    },
  );

  const [artistRequests, total]: [ArtistRequest[], number] =
    await queryBuilder.apply(req.query).getManyAndCount();

  const avatarPaths = artistRequests
    .map(ar => ar.user.avatar)
    .filter((path): path is string => Boolean(path));

  const portfolioPaths = artistRequests
  .flatMap(ar => ar.portfolios ?? [])
  .map(p => p.filePath)
  .filter((path): path is string => Boolean(path));

  const avatarMap = await MinioService.getPublicUrls(avatarPaths);
  const portfolioMap = await MinioService.getPublicUrls(portfolioPaths);

  const serializedData = await artistRequestSerializer(
    artistRequests, 
    avatarMap, 
    portfolioMap,
    [],
    true
  );

  return apiResponse(res, {
    statusCode: 200,
    success: true,
    data: serializedData,
    pagination: {
      page,
      limit,
      total
    },
    req
  });
};

export const artistRequestUpdate = async (req: Request, res: Response) => {
    try {
        const requestId = Number(req.params.id);
        const serializer = await updateArtistRequestSerializer(requestId, req.body)
        return apiResponse(
            res, {
                data: serializer
            }
        )
    } catch (err) {
        return apiResponse(
            res, {
                message: 'something went wrong in updating request',
                errors: String(err)
            }
        )
    }

}

export const artistRequestRetrieveController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const artistRequest = await artistRequestRepository()
    .createQueryBuilder('artists')
    .leftJoinAndSelect('artists.categories', 'categories')
    .leftJoinAndSelect('artists.user', 'user')
    .leftJoinAndSelect('artists.portfolios', 'portfolios')
    .leftJoinAndSelect('artists.rejectedReasons', 'rejectedReasons')
    .addOrderBy('rejectedReasons.createdAt', 'DESC')
    .where('artists.id = :id', { id })
    .getOne();

  if (!artistRequest) {
    return apiResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Artist request not found',
    });
  }

  const avatarPath = artistRequest.user?.avatar;
  const avatarMap = avatarPath
    ? await MinioService.getPublicUrls([avatarPath])
    : {};

  const portfolioPaths = (artistRequest.portfolios ?? [])
  .map(p => p.filePath)
  .filter((path): path is string => Boolean(path));

  const portfolioMap = await MinioService.getPublicUrls(portfolioPaths);
  const [serializedData] = await artistRequestSerializer(
    [artistRequest], 
    avatarMap, 
    portfolioMap,
    [],
    true
  );

  return apiResponse(res, {
    statusCode: 200,
    success: true,
    data: serializedData,
  });
}

export const userArtistRequestsController = async (req: Request, res: Response) => {
  const {id} = req.params;
  const requests = await artistRequestRepository().find({
    where: { user: { id: Number(id) } },
    relations: ['portfolios', 'user', 'rejectedReasons', 'categories'],
    order: {
      rejectedReasons: {
        createdAt: 'DESC'
      }
    }
  })

  const avatarPaths = requests
    .map(ar => ar.user.avatar)
    .filter((path): path is string => Boolean(path));

  const portfolioPaths = requests
  .flatMap(ar => ar.portfolios ?? [])
  .map(p => p.filePath)
  .filter((path): path is string => Boolean(path));

  const avatarMap = await MinioService.getPublicUrls(avatarPaths);
  const portfolioMap = await MinioService.getPublicUrls(portfolioPaths);

  const data = await artistRequestSerializer(
    requests, 
    avatarMap, 
    portfolioMap,
    [],
    true
  )

  return apiResponse(res, {
    data
  })
  
}