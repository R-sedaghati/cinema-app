import { Request, Response } from "express";
import { bannerRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { SearchAndFilterService } from "../../services/searchAndFilter.js";
import { Banner } from "../../entities/Banner.js";
import { MinioService } from "../../services/minio.js";

const serializeBanner = async (banner: Banner) => ({
    ...banner,
    image: await banner.getImageUrl(),
});

export const bannerListController = async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.count) || 10));

    const query = bannerRepository()
        .createQueryBuilder("banner")
        .orderBy("banner.priority", "ASC")
        .addOrderBy("banner.id", "ASC")
        .skip((page - 1) * limit)
        .take(limit);

    const queryBuilder = new SearchAndFilterService<Banner>(query, {
        filterable: {
            isActive: "banner.isActive",
        },
        searchable: ["banner.title"],
        sortable: {},
    });

    const [banners, total]: [Banner[], number] = await queryBuilder.apply(req.query).getManyAndCount();

    const urlMap = await MinioService.getPublicUrls(banners.map((b) => b.image));
    const data = banners.map((banner) => ({
        ...banner,
        image: urlMap[banner.image] ?? null,
    }));

    return apiResponse(res, {
        data,
        pagination: { page, limit, total },
        req,
    });
};

export const bannerRetrieveController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const banner = await bannerRepository().findOne({
        where: { id: Number(id) }
    })

    if (!banner) {
        return apiResponse(res, {
            message: 'no banner found!',
            statusCode: 400
        })
    }

    return apiResponse(res, {
        data: await serializeBanner(banner)
    })
}

export const bannerCreateController = async (req: Request, res: Response) => {
    const { title, subtitle, image, ctaLabel, ctaLink, priority, isActive } = req.body;

    if (!title || !subtitle || !image || !ctaLabel || !ctaLink) {
        return apiResponse(res, {
            message: 'title, subtitle, image, ctaLabel and ctaLink are required!',
            statusCode: 400,
        });
    }

    const banner = bannerRepository().create({
        title,
        subtitle,
        image,
        ctaLabel,
        ctaLink,
        priority: priority ?? 0,
        isActive: isActive ?? true,
    });
    const saved = await bannerRepository().save(banner);

    return apiResponse(res, {
        statusCode: 201,
        data: await serializeBanner(saved),
    });
};

export const bannerUpdateController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, subtitle, image, ctaLabel, ctaLink, priority, isActive } = req.body;

    const banner = await bannerRepository().findOne({
        where: { id: Number(id) }
    })

    if (!banner) {
        return apiResponse(res, {
            message: 'no banner found!',
            statusCode: 400
        })
    }

    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (image !== undefined) banner.image = image;
    if (ctaLabel !== undefined) banner.ctaLabel = ctaLabel;
    if (ctaLink !== undefined) banner.ctaLink = ctaLink;
    if (priority !== undefined) banner.priority = priority;
    if (isActive !== undefined) banner.isActive = isActive;

    const saved = await bannerRepository().save(banner)

    return apiResponse(res, {
        data: await serializeBanner(saved)
    })
}

export const bannerDeleteController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const banner = await bannerRepository().findOne({
        where: { id: Number(id) }
    })

    if (!banner) {
        return apiResponse(res, {
            message: 'no banner found!',
            statusCode: 400
        })
    }

    await bannerRepository().softRemove(banner);

    return apiResponse(res, {
        data: null
    })
}
