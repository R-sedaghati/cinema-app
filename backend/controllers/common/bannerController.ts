import { Request, Response } from "express";
import { bannerRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { MinioService } from "../../services/minio.js";

export const bannerListCommonController = async (req: Request, res: Response) => {
    const banners = await bannerRepository().find({
        where: { isActive: true },
        order: { priority: "ASC", id: "ASC" },
    });

    const urlMap = await MinioService.getPublicUrls(banners.map((b) => b.image));

    const data = banners.map((banner) => ({
        ...banner,
        image: urlMap[banner.image] ?? null,
    }));

    return apiResponse(res, {
        data
    })
}
